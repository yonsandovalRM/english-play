import { useUser } from '../../context/UserContext';

export default function Header() {
  const { progress } = useUser();

  return (
    <header className="header">
      <div className="header-logo">
        <span className="header-logo-icon">🇬🇧</span>
        <h1>EnglishPlay</h1>
      </div>
      <div className="header-stats">
        {progress.streak > 0 && (
          <div className="header-stat">
            <span className="streak-badge">🔥</span>
            <span className="header-stat-value">{progress.streak}</span>
          </div>
        )}
        <div className="header-stat">
          <span className="header-stat-icon">⭐</span>
          <span className="header-stat-value">{progress.xp} XP</span>
        </div>
      </div>
    </header>
  );
}
