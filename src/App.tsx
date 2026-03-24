import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Games from './pages/Games';
import Vocabulary from './pages/Vocabulary';
import VocabularyDetail from './pages/VocabularyDetail';
import Profile from './pages/Profile';
import HangmanGame from './pages/games/HangmanGame';
import FillBlankGame from './pages/games/FillBlankGame';

function App() {
  useEffect(() => {
    // Enable dark mode by default for shadcn
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="games/hangman" element={<HangmanGame />} />
            <Route path="games/fill-blank" element={<FillBlankGame />} />
            <Route path="vocabulary" element={<Vocabulary />} />
            <Route path="vocabulary/:categoryId" element={<VocabularyDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
