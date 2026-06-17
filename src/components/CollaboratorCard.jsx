import React from 'react';

const CollaboratorCard = ({ data }) => {
  const {
    nombre_completo,
    usuario_github,
    comentario_libre,
    color,
    apodo,
    emoji,
    frase_motivacional,
    lenguaje_favorito,
    hobby,
    comida_favorita,
    superpoder,
    nivel_programador,
    estado_actual
  } = data;

  const avatarUrl = `https://github.com/${usuario_github}.png`;
  const githubUrl = `https://github.com/${usuario_github}`;

  // Color de acento proporcionado por el estudiante, sino usamos el amarillo de Duoc como fallback
  const customStyle = color ? { backgroundColor: color } : {};

  // Mapeo de niveles a emojis para visualización rápida
  const nivelIcons = {
    junior: '🌱',
    mid: '⚡',
    senior: '🔥',
    trainee: '📖',
    lead: '👑'
  };

  return (
    <div className="collaborator-card" style={{ borderColor: color, borderWidth: color ? '2px' : '0', borderStyle: 'solid' }}>
      <div className="card-accent" style={customStyle}></div>

      {/* Header: Emoji + Avatar + Apodo */}
      <div className="card-header-section">
        {emoji && <span className="card-emoji">{emoji}</span>}
        <img
          src={avatarUrl}
          alt={`Avatar de ${nombre_completo}`}
          className="card-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
          }}
        />
        {apodo && <span className="card-nickname">{apodo}</span>}
      </div>

      <div className="card-content">
        <h3 className="card-title">{nombre_completo}</h3>
        <p className="card-bio">{comentario_libre}</p>

        {/* Badges de identidad dev — alta importancia */}
        {(lenguaje_favorito || nivel_programador || estado_actual) && (
          <div className="card-badges">
            {lenguaje_favorito && (
              <span className="card-badge badge-lang">💻 {lenguaje_favorito}</span>
            )}
            {nivel_programador && (
              <span className="card-badge badge-level">
                {nivelIcons[nivel_programador?.toLowerCase()] || '🎯'} {nivel_programador}
              </span>
            )}
            {estado_actual && (
              <span className="card-badge badge-status">📍 {estado_actual}</span>
            )}
          </div>
        )}

        {/* Frase motivacional — media importancia */}
        {frase_motivacional && (
          <blockquote className="card-quote">
            "{frase_motivacional}"
          </blockquote>
        )}

        {/* Detalles personales — importancia secundaria */}
        {(superpoder || hobby || comida_favorita) && (
          <div className="card-details">
            {superpoder && (
              <span className="card-detail-item" title="Superpoder">🦸 {superpoder}</span>
            )}
            {hobby && (
              <span className="card-detail-item" title="Hobby">🎮 {hobby}</span>
            )}
            {comida_favorita && (
              <span className="card-detail-item" title="Comida favorita">🍕 {comida_favorita}</span>
            )}
          </div>
        )}

        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="card-cta">
          Ver Perfil de GitHub
        </a>
      </div>
    </div>
  );
};

export default CollaboratorCard;
