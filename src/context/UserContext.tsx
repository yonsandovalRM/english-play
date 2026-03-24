import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserProgress } from '../types';
import { levels } from '../data/games';

const STORAGE_KEY = 'english-play-progress';

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayedDate: null,
  gamesPlayed: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  wordsLearned: [],
  achievements: [],
};

type Action =
  | { type: 'ADD_XP'; payload: number }
  | { type: 'CORRECT_ANSWER'; payload?: string }
  | { type: 'WRONG_ANSWER' }
  | { type: 'GAME_PLAYED' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'RESET' }
  | { type: 'LOAD'; payload: UserProgress };

function calculateLevel(xp: number): number {
  let currentLevel = 1;
  for (const l of levels) {
    if (xp >= l.xpRequired) {
      currentLevel = l.level;
    }
  }
  return currentLevel;
}

function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = progress.lastPlayedDate;

  if (lastPlayed === today) {
    return { ...progress, lastPlayedDate: today };
  }

  if (lastPlayed) {
    const lastDate = new Date(lastPlayed);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      return { ...progress, streak: progress.streak + 1, lastPlayedDate: today };
    } else if (diffDays > 1) {
      return { ...progress, streak: 1, lastPlayedDate: today };
    }
  }

  return { ...progress, streak: 1, lastPlayedDate: today };
}

function progressReducer(state: UserProgress, action: Action): UserProgress {
  switch (action.type) {
    case 'ADD_XP': {
      const newXp = state.xp + action.payload;
      return { ...state, xp: newXp, level: calculateLevel(newXp) };
    }
    case 'CORRECT_ANSWER': {
      const newWords = action.payload && !state.wordsLearned.includes(action.payload)
        ? [...state.wordsLearned, action.payload]
        : state.wordsLearned;
      return {
        ...state,
        correctAnswers: state.correctAnswers + 1,
        totalAnswers: state.totalAnswers + 1,
        wordsLearned: newWords,
      };
    }
    case 'WRONG_ANSWER':
      return { ...state, totalAnswers: state.totalAnswers + 1 };
    case 'GAME_PLAYED': {
      const updated = updateStreak(state);
      return { ...updated, gamesPlayed: updated.gamesPlayed + 1 };
    }
    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.payload)) return state;
      return { ...state, achievements: [...state.achievements, action.payload] };
    case 'RESET':
      return defaultProgress;
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

interface UserContextType {
  progress: UserProgress;
  dispatch: React.Dispatch<Action>;
  currentLevelInfo: { current: typeof levels[0]; next: typeof levels[0] | null; progressPercent: number };
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(progressReducer, defaultProgress);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD', payload: { ...defaultProgress, ...parsed } });
      } catch {
        // ignore parsing errors
      }
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const currentLevel = levels.find((l) => l.level === progress.level) || levels[0];
  const nextLevel = levels.find((l) => l.level === progress.level + 1) || null;
  const progressPercent = nextLevel
    ? ((progress.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;

  const currentLevelInfo = { current: currentLevel, next: nextLevel, progressPercent };

  return (
    <UserContext.Provider value={{ progress, dispatch, currentLevelInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
