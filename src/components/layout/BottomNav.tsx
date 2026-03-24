import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Inicio', icon: '🏠', end: true },
  { to: '/games', label: 'Juegos', icon: '🎮' },
  { to: '/vocabulary', label: 'Vocab', icon: '📚' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-5 left-0 w-full flex justify-center z-50 pointer-events-none px-4">
      <nav className="pointer-events-auto flex gap-1 p-1.5 rounded-[28px] bg-[rgba(14,14,22,0.92)] backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
        {navItems.map(({ to, label, icon, end }) => {
          const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={[
                'flex flex-col items-center justify-center relative w-[70px] h-[52px] rounded-[22px] no-underline transition-all duration-200',
                'text-[10px] font-bold uppercase tracking-wider gap-0.5',
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-[0_4px_16px_rgba(108,99,255,0.4)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06]',
              ].join(' ')}
            >
              <span className={`text-xl leading-none transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {icon}
              </span>
              <span className="text-[10px]">{label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/50" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
