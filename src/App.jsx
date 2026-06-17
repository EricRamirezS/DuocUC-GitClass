import React, { useState, useEffect } from 'react';
import CollaboratorCard from './components/CollaboratorCard';
import './index.css';
import { useRef } from 'react';

// Importa dinámicamente todos los archivos JSON en la carpeta colaboradores usando Vite
const jsonFiles = import.meta.glob('./collaborators/*.json', { eager: true });

function App() {
  const canvasRef = useRef(null);
  const [collaborators, setCollaborators] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showTerminal, setShowTerminal] = useState(true);


  useEffect(() => {
    // Extraemos los valores y nos aseguramos de que existan
    const loadedCollaborators = Object.keys(jsonFiles)
      .filter(path => !path.includes('_plantilla.json'))
      .map(path => jsonFiles[path].default || jsonFiles[path]);

    setCollaborators(loadedCollaborators);

    const sequence = ["> git init sistema...", "> git fetch colaboradores..."];

    // Usamos encadenamiento opcional (?.) para evitar el error de 'undefined'
    loadedCollaborators.forEach((c) => {
      if (c?.nombre_completo) {
        sequence.push(`> git add: ${c.nombre_completo} ✔`);
      }
    });

    sequence.push(
      "> git commit -m 'validando perfiles'...",
      "> git push origin main...",
      "✔ DEPLOY EXITOSO",
      "> renderizando interfaz..."
    );

    setLogs(sequence);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const letters = "01";
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 40, 85, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFB81C";
      ctx.font = fontSize + "px monospace";

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;

        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });
    };

    const interval = setInterval(draw, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logs.length === 0) return;

    let i = 0;

    const interval = setInterval(() => {
      if (i >= logs.length) {
        clearInterval(interval);

        setTimeout(() => {
          setShowTerminal(false);
        }, 1500);

        return;
      }

      setVisibleLogs((prev) => [...prev, logs[i]]);
      i++;
    }, 50);

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="app-container">

      <header className="app-header matrix-enhanced">
        <canvas ref={canvasRef} id="matrixCanvas" />
        <h1 className="glow-title">
          Domina Git &amp; GitHub — Tu primer paso en el mundo tech
        </h1>

        <div className="course-info">
          <h2>Generación 2026 · Duoc UC</h2>
          <p className="course-subtitle">
            Git, GitHub &amp; Control de Versiones — Fundamentos de Informática
          </p>
        </div>

        <p className="institutional-motto">
          Versiona, colabora y construye en equipo.
        </p>

        <div className="quote-container">
          <p className="inspiration-quote">
            "Cada commit cuenta una historia. Cada merge construye el legado."
          </p>
        </div>
      </header>
      <main className="app-main">

        {showTerminal ? (
          <div className="terminal-fullscreen">
            <div className="terminal-container">
              {visibleLogs.map((line, index) => {
                // Verificación ultra-segura
                const isSuccess = line && typeof line === 'string' && line.includes("DEPLOY");

                return (
                  <p
                    key={`log-${index}`}
                    className={`terminal-line ${isSuccess ? "success" : ""}`}
                  >
                    {line || ""}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="collaborators-grid fade-in">
              {collaborators.length > 0 ? (
                collaborators.map((collab, index) => (
                  <CollaboratorCard
                    key={collab.usuario_github}
                    data={collab}
                  />))
              ) : (
                <div className="empty-message">
                  <p>No hay colaboradores para mostrar.</p>
                  <p>¡Añade tu tarjeta mediante un Pull Request!</p>
                </div>
              )}
            </div>
          </>
        )}

      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Duoc UC - Git, GitHub & Control de Versiones</p>
      </footer>
    </div>
  );
}

export default App;
