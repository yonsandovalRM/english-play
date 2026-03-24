// ==========================================
// Vocabulary & Phrases
// ==========================================

export type VocabularyWord = {
  en: string;
  es: string;
};

export type VocabularyCategory = {
  id: string;
  name: string;
  nameEs: string;
  icon: string;
  words: VocabularyWord[];
};

export type Phrase = {
  sentence: string;
  translation: string;
  blank: string; // the word that goes in the blank
  options?: string[];
};

export type PhraseStructure = {
  id: string;
  name: string;
  nameEs: string;
  icon: string;
  description: string;
  phrases: Phrase[];
};

// ==========================================
// Game Types
// ==========================================

export type GameId = 'hangman' | 'match-pairs' | 'fill-blank' | 'word-scramble' | 'listen-type' | 'picture-quiz' | 'speed-round';

export type GameInfo = {
  id: GameId;
  name: string;
  nameEs: string;
  description: string;
  icon: string;
  available: boolean;
  color: string;
};

// ==========================================
// User Progress
// ==========================================

export type UserProgress = {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string | null;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  wordsLearned: string[];
  achievements: string[];
};

export type LevelInfo = {
  level: number;
  title: string;
  icon: string;
  xpRequired: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
};

// Dummy export to keep the file alive in build
export const PROJECT_TYPES_LOADED = true;
