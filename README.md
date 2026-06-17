# GitClass - Repositorio de Colaboradores Duoc UC

🔗 **Sitio Web en Vivo:** [https://fullstack-gitclass.onrender.com](https://fullstack-gitclass.onrender.com)

Este proyecto es una aplicación React (scaffolded con Vite) para aprender **Git, GitHub y Control de Versiones** en Duoc UC. Su propósito es enseñar el flujo de trabajo colaborativo usando Git (Manejo de Ramas, Pull Requests, y CI/CD).

> *"Cada commit cuenta una historia. Cada merge construye el legado."*

## 🚀 Cómo agregar tu tarjeta (Para los Estudiantes)

¡El objetivo principal de esta tarea es que agregues tu propia tarjeta sin modificar ningún archivo central de la aplicación! Solo necesitas agregar un archivo JSON con tu información.

### Flujo de trabajo (Workflow)
1. **Haz un Fork** de este repositorio.
2. **Clona** tu fork localmente.
3. **Crea una nueva rama**: `git checkout -b feature/agregar-tunombre`
4. **Agrega tu archivo**:
    - Ve a la carpeta `src/collaborators/`.
    - Duplica o copia el archivo `_plantilla.json` y nómbralo con tu usuario de GitHub (ej. `tuusuario.json`).
    - Modifica el archivo con tu información:
      ```json
      {
        "nombre_completo": "Tu Nombre y Apellido",
        "usuario_github": "tu-usuario-de-github",
        "comentario_libre": "Un breve mensaje o biografía (máx. 150 caracteres).",
        "color": "#FFB81C",

        "apodo": "El Bug Slayer",
        "emoji": "🚀",
        "frase_motivacional": "Compila a la primera (casi nunca)",

        "lenguaje_favorito": "JavaScript",
        "hobby": "Gaming",
        "comida_favorita": "Pizza",

        "superpoder": "Encontrar bugs en producción",
        "nivel_programador": "junior",
        "estado_actual": "Buscando práctica"
      }
      ```

    **Campos obligatorios:** `nombre_completo`, `usuario_github`, `comentario_libre`

    **Campos opcionales:** `color`, `apodo`, `emoji`, `frase_motivacional`, `lenguaje_favorito`, `hobby`, `comida_favorita`, `superpoder`, `nivel_programador`, `estado_actual`

    > **Nota:** El campo `nivel_programador` solo acepta: `trainee`, `junior`, `mid`, `senior`, `lead`.

5. **Realiza un Commit**: `git commit -m "Agrega tarjeta de Tu Nombre"`
6. **Sube los cambios (Push)**: `git push origin feature/agregar-tunombre`
7. **Crea un Pull Request (PR)** hacia la rama principal (`main`) de este repositorio.

Una vez que tu PR sea aprobado y mezclado (merged), un sistema de CI/CD redesplegará automáticamente la página en Render, ¡y tu tarjeta aparecerá en vivo!

---

## 🛠️ Para ejecutar el proyecto localmente

1. Debes tener Node.js instalado (versión 18+).
2. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` en tu navegador.

## 🎨 Arquitectura y Diseño

- **Vite + React:** Carga inicial rápida y desarrollo fluido.
- **import.meta.glob:** Utilizamos Vite para importar dinámicamente y de forma ágil todos los archivos de colaboradores en la carpeta `src/collaborators`, eliminando la necesidad de gestionar un array unificado.
- **Paleta de Colores Institucional:** Usando la gama de colores Duoc UC para fomentar el sentido de identidad y profesionalidad (Integridad, Calidad, y Espíritu de Servicio).

---
**Institución:** Duoc UC  
**Curso:** Git, GitHub & Control de Versiones
