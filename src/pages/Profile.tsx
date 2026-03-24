import { useUser } from '../context/UserContext';
import { achievements } from '../data/games';

export default function Profile() {
  const { progress, currentLevelInfo } = useUser();

  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  return (
    <div>
      {/* Profile Header */}
      <div className="profile-header animate-fade-in">
        <div className="profile-avatar">
          {currentLevelInfo.current.icon}
        </div>
        <h1 className="page-title">Mi Perfil</h1>
        <div className="profile-level">
          Level {progress.level} — {currentLevelInfo.current.title}
        </div>
      </div>

      {/* XP Progress */}
      <div className="card animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Experiencia</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-xp)' }}>
            {progress.xp} XP
            {currentLevelInfo.next && ` / ${currentLevelInfo.next.xpRequired} XP`}
          </span>
        </div>
        <div className="progress-bar progress-bar-xp">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(currentLevelInfo.progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="section-header">
        <h3 className="section-title">📊 Estadísticas</h3>
      </div>
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card stat-card animate-fade-in-up stagger-2">
          <div className="stat-card-icon">🎮</div>
          <div className="stat-card-value">{progress.gamesPlayed}</div>
          <div className="stat-card-label">Partidas jugadas</div>
        </div>
        <div className="card stat-card animate-fade-in-up stagger-3">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-value">{accuracy}%</div>
          <div className="stat-card-label">Precisión</div>
        </div>
        <div className="card stat-card animate-fade-in-up stagger-4">
          <div className="stat-card-icon">📝</div>
          <div className="stat-card-value">{progress.wordsLearned.length}</div>
          <div className="stat-card-label">Palabras aprendidas</div>
        </div>
        <div className="card stat-card animate-fade-in-up stagger-5">
          <div className="stat-card-icon">🔥</div>
          <div className="stat-card-value">{progress.streak}</div>
          <div className="stat-card-label">Racha (días)</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="section-header">
        <h3 className="section-title">🏆 Logros</h3>
      </div>
      <div className="achievements-grid">
        {achievements.map((ach, i) => {
          const unlocked = progress.achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`card achievement-card ${unlocked ? 'unlocked' : ''} animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="achievement-icon">{ach.icon}</div>
              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-desc">{ach.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
