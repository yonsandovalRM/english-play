import { useUser } from '../../context/UserContext';

export default function Header() {
  const { progress, currentLevelInfo } = useUser();
  const { current, next, progressPercent } = currentLevelInfo;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-2.5">

        {/* Avatar + Name */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {progress.avatar ? (
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-xl shadow-md shrink-0">
              {progress.avatar}
            </div>
          ) : (
            <span className="text-2xl leading-none">🇬🇧</span>
          )}
          <div className="flex flex-col gap-0 min-w-0">
            {progress.playerName ? (
              <span className="font-black text-base leading-tight text-foreground font-display truncate">
                {progress.playerName}
              </span>
            ) : (
              <span className="font-black text-lg leading-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent font-display">
                EnglishPlay
              </span>
            )}
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold leading-none">
              {current.icon} {current.title} · Nv. {progress.level}
            </span>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {progress.streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/25 text-orange-400">
              <span>🔥</span>
              <span>{progress.streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
            <span>⭐</span>
            <span>{progress.xp}</span>
          </div>
        </div>
      </div>

      {/* XP level progress bar */}
      {next && (
        <div className="h-[3px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      )}
    </header>
  );
}
