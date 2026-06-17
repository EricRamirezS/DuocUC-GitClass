import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Collaborators JSON Format', () => {
  const collaboratorsDir = path.join(__dirname, 'collaborators');
  // Obtener todos los archivos JSON del directorio
  const files = fs.readdirSync(collaboratorsDir).filter(file => file.endsWith('.json'));

  // Excluimos la plantilla si queremos, aunque es buena idea evaluarla también.
  // En este caso, iteraremos sobre todos los archivos JSON de alumnos.
  const studentFiles = files.filter(file => file !== '_plantilla.json');

  it('debería haber al menos un archivo JSON de estudiante además de la plantilla', () => {
    expect(studentFiles.length).toBeGreaterThan(0);
  });

  describe('Integridad de la Plantilla Core', () => {
    it('el archivo _plantilla.json debe existir intacto y no debe ser modificado por los alumnos', () => {
      const templatePath = path.join(collaboratorsDir, '_plantilla.json');
      const exists = fs.existsSync(templatePath);
      expect(exists).toBe(true, 'CRÍTICO: Alguien ha borrado o renombrado el archivo _plantilla.json');
      
      const data = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
      expect(data.nombre_completo).toBe('Tu Nombre y Apellido', 'La plantilla fue alterada en su nombre');
      expect(data.usuario_github).toBe('tu-usuario-de-github', 'La plantilla fue alterada en su usuario');
    });
  });

  // Lista negra de palabras ofensivas, racistas o figuras polémicas
  const forbiddenWords = [
    // Figuras polémicas / Ideologías del odio
    'hitler', 'pinochet', 'videla', 'franco', 'mussolini', 'stalin', 'nazi', 'fascis', 'kkk', 'supremacist',

    // Groserías y vulgaridades (General LATAM)
    'mierda', 'puta', 'puto', 'pendej', 'idiota', 'estupid', 'zorra', 'chupa', 'perra', 'bastardo', 'verga', 'pija', 'cabron', 'cojon', 'imbecil',

    // Chilenismos ofensivos (raíces y variaciones)
    'weon', 'aweona', 'maricon', 'qlo', 'qlia', 'culiao', 'culia', 'ctm', 'conchet', 'reconche', 'pico', 'chucha', 'maraca', 'maraco', 'sacoewea',

    // Groserías en inglés (comunes en el entorno tech/internet)
    'fuck', 'bitch', 'shit', 'asshole', 'dick', 'cunt', 'slut', 'motherfucker',

    // Racismo, Xenofobia y Discriminación
    'esclavo', 'sudaca', 'nigger', 'nigga', 'veneco', 'masisi', 'faggot', 'retardado', 'mongolico', 'indio'
  ];

  function containsForbiddenWords(text) {
    if (!text) return false;
    // Normalizamos el texto (quitando tildes y pasando a minúscula) para evitar fintas como "Pínöchét"
    const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return forbiddenWords.some(word => normalized.includes(word));
  }

  // Campos de texto libre que deben ser escaneados por contenido ofensivo
  const textFieldsToScan = [
    'nombre_completo',
    'comentario_libre',
    'apodo',
    'frase_motivacional',
    'lenguaje_favorito',
    'hobby',
    'comida_favorita',
    'superpoder',
    'nivel_programador',
    'estado_actual'
  ];

  // Generamos dinámicamente un bloque de pruebas por cada archivo encontrado
  studentFiles.forEach(file => {
    describe(`Evaluando archivo: ${file}`, () => {
      const filePath = path.join(collaboratorsDir, file);

      it('debe estar en formato JSON correctamente estructurado', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrowError();
      });

      it('el archivo no debe pesar más de 2 KB (Prevención DOS)', () => {
        const stats = fs.statSync(filePath);
        expect(stats.size).toBeLessThanOrEqual(2048); // max 2048 bytes
      });

      it('el nombre del archivo debe coincidir exactamente con el usuario_github para evitar Spoofing', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const expectedFilename = `${data.usuario_github}.json`.toLowerCase();
        expect(file.toLowerCase()).toBe(expectedFilename);
      });

      it('debe contener los campos obligatorios con el tipo de dato correcto', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Validar nombre completo
        expect(data).toHaveProperty('nombre_completo');
        expect(typeof data.nombre_completo).toBe('string');
        expect(data.nombre_completo.trim()).not.toBe('');

        // Validar usuario de github
        expect(data).toHaveProperty('usuario_github');
        expect(typeof data.usuario_github).toBe('string');
        expect(data.usuario_github.trim()).not.toBe('');
        // Debe cumplir el estándar de nombres de usuarios reales de Github (regex)
        expect(data.usuario_github).toMatch(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i);

        // Validar comentario libre
        expect(data).toHaveProperty('comentario_libre');
        expect(typeof data.comentario_libre).toBe('string');
        expect(data.comentario_libre.length).toBeLessThanOrEqual(150, 'El comentario debe tener 150 caracteres o menos');
      });

      it('los campos opcionales, si existen, deben tener tipo y longitud válidos', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Validar campos opcionales de texto libre
        const optionalTextFields = {
          apodo: 40,
          frase_motivacional: 120,
          lenguaje_favorito: 30,
          hobby: 50,
          comida_favorita: 50,
          superpoder: 80,
          nivel_programador: 20,
          estado_actual: 50
        };

        for (const [field, maxLen] of Object.entries(optionalTextFields)) {
          if (data[field] !== undefined) {
            expect(typeof data[field]).toBe('string', `El campo '${field}' debe ser un string`);
            expect(data[field].length).toBeLessThanOrEqual(maxLen, `El campo '${field}' excede el máximo de ${maxLen} caracteres`);
          }
        }

        // Validar emoji si existe (debe ser un string corto)
        if (data.emoji !== undefined) {
          expect(typeof data.emoji).toBe('string', 'El campo emoji debe ser un string');
          expect(data.emoji.length).toBeLessThanOrEqual(4, 'El emoji debe tener máximo 4 caracteres');
        }

        // Validar nivel_programador si existe (valores válidos)
        if (data.nivel_programador !== undefined) {
          const validLevels = ['trainee', 'junior', 'mid', 'senior', 'lead'];
          expect(validLevels).toContain(
            data.nivel_programador.toLowerCase(),
            `nivel_programador inválido: '${data.nivel_programador}'. Valores válidos: ${validLevels.join(', ')}`
          );
        }
      });

      it('no debe contener lenguaje ofensivo, racista, xenófobo ni menciones a figuras polémicas', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        for (const field of textFieldsToScan) {
          if (data[field]) {
            const isClean = !containsForbiddenWords(data[field]);
            expect(isClean).toBe(true, `El campo '${field}' de ${file} contiene lenguaje inapropiado o figuras polémicas.`);
          }
        }
      });

      it('no debe contener inyección HTML / XSS en ningún campo de texto (uso malicioso de < o >)', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        for (const field of textFieldsToScan) {
          if (data[field]) {
            expect(data[field]).not.toMatch(/[<>]/, `El campo '${field}' contiene caracteres HTML potencialmente peligrosos`);
          }
        }
      });

      it('el campo color es opcional, pero si existe debe ser un string válido y seguro (Prevención Inyección CSS)', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        if (data.color !== undefined) {
          expect(typeof data.color).toBe('string');
          expect(data.color.trim()).not.toBe('');
          
          // Prevenimos inyección de propiedades css abusivas o ejecución
          expect(data.color).not.toMatch(/[;{}<>"'`]/);
          expect(data.color).not.toMatch(/url\(/i);
        }
      });

      it('el usuario de Github debe existir realmente', async () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const username = data.usuario_github;

        // Hacemos una llamada a la API de GitHub para verificar que el usuario exista
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        // Si el estado es 404, significa que el usuario no existe.
        const existe = response.status !== 404;
        expect(existe).toBe(true, `El usuario de GitHub '${username}' del archivo ${file} no existe. Por favor revisa que este bien escrito.`);
      });
    });
  });
});
