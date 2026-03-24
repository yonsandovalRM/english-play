import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`} 
        end
      >
        <span className="nav-item-icon">🏠</span>
        <span>Inicio</span>
      </NavLink>
      <NavLink 
        to="/games" 
        className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-item-icon">🎮</span>
        <span>Juegos</span>
      </NavLink>
      <NavLink 
        to="/vocabulary" 
        className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-item-icon">📚</span>
        <span>Vocabulario</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-item-icon">👤</span>
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}
