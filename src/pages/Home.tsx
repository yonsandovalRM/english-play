import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { games } from '../data/games';
import { vocabularyCategories } from '../data/vocabulary';

export default function Home() {
  const { progress, currentLevelInfo } = useUser();

  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  const availableGames = games.filter((g) => g.available);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner animate-fade-in">
        <div className="welcome-banner-content">
          <h2>👋 ¡Hola!</h2>
          <p>¿Listo para aprender inglés hoy?</p>

          <div className="welcome-level">
            <div className="welcome-level-badge">
              <span>{currentLevelInfo.current.icon}</span>
              <span>{currentLevelInfo.current.title}</span>
            </div>
            <span className="welcome-xp">
              {progress.xp} XP
              {currentLevelInfo.next && ` / ${currentLevelInfo.next.xpRequired} XP`}
            </span>
          </div>
          <div className="welcome-progress">
            <div
              className="welcome-progress-fill"
              style={{ width: `${Math.min(currentLevelInfo.progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <div className="section-header">
          <h3 className="section-title">📊 Tu Progreso</h3>
        </div>
        <div className="stats-grid">
          <div className="card stat-card animate-fade-in-up stagger-1">
            <div className="stat-card-icon">🎮</div>
            <div className="stat-card-value">{progress.gamesPlayed}</div>
            <div className="stat-card-label">Partidas</div>
          </div>
          <div className="card stat-card animate-fade-in-up stagger-2">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-value">{accuracy}%</div>
            <div className="stat-card-label">Precisión</div>
          </div>
          <div className="card stat-card animate-fade-in-up stagger-3">
            <div className="stat-card-icon">📝</div>
            <div className="stat-card-value">{progress.wordsLearned.length}</div>
            <div className="stat-card-label">Palabras</div>
          </div>
          <div className="card stat-card animate-fade-in-up stagger-4">
            <div className="stat-card-icon">🏆</div>
            <div className="stat-card-value">{progress.achievements.length}</div>
            <div className="stat-card-label">Logros</div>
          </div>
        </div>
      </div>

      {/* Quick Play */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <div className="section-header">
          <h3 className="section-title">🎮 Jugar Ahora</h3>
          <Link to="/games" className="section-link">Ver todos →</Link>
        </div>
        <div className="games-grid">
          {availableGames.map((game, i) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className={`card card-interactive animate-fade-in-up stagger-${i + 1}`}
            >
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
          ))}
        </div>
      </div>

      {/* Vocabulary Categories */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <div className="section-header">
          <h3 className="section-title">📚 Categorías</h3>
          <Link to="/vocabulary" className="section-link">Ver todas →</Link>
        </div>
        <div className="category-chips">
          {vocabularyCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/vocabulary/${cat.id}`}
              className="category-chip"
            >
              <span className="category-chip-icon">{cat.icon}</span>
              <span>{cat.nameEs}</span>
              <span className="category-chip-count">{cat.words.length}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
