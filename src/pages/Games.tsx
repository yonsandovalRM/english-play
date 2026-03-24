import { Link } from 'react-router-dom';
import { games } from '../data/games';

export default function Games() {
  return (
    <div>
      <h1 className="page-title animate-fade-in">🎮 Minijuegos</h1>
      <p className="page-subtitle animate-fade-in">Elige un juego y comienza a practicar</p>

      <div className="games-grid">
        {games.map((game, i) => (
          <div key={game.id} className={`animate-fade-in-up stagger-${i + 1}`}>
            {game.available ? (
              <Link to={`/games/${game.id}`} className="card card-interactive">
                <div className="game-card">
                  <div className="game-card-icon" style={{ background: game.color }}>
                    {game.icon}
                  </div>
                  <div className="game-card-info">
                    <div className="game-card-name">{game.nameEs}</div>
                    <div className="game-card-desc">{game.description}</div>
                  </div>
                  <div className="game-card-arrow">→</div>
                </div>
              </Link>
            ) : (
              <div className="card game-card-locked">
                <div className="game-card">
                  <div className="game-card-icon" style={{ background: game.color }}>
                    {game.icon}
                  </div>
                  <div className="game-card-info">
                    <div className="game-card-name">{game.nameEs}</div>
                    <div className="game-card-desc">{game.description}</div>
                  </div>
                  <span className="game-card-badge">Próximamente</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
