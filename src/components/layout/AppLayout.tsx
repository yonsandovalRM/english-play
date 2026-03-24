import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import PlayerSetup from './PlayerSetup';
import { useUser } from '../../context/UserContext';

export default function AppLayout() {
  const { progress } = useUser();
  const [setupDone, setSetupDone] = useState(false);

  const needsSetup = !progress.playerName && !setupDone;

  return (
    <div className="app-layout">
      {needsSetup && <PlayerSetup onDone={() => setSetupDone(true)} />}
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <div className="nav-container">
        <BottomNav />
      </div>
    </div>
  );
}
