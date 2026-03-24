import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { vocabularyCategories } from '../../data/vocabulary';
import type { VocabularyCategory, VocabularyWord } from '../../types';

type GameState = 'select' | 'playing' | 'won' | 'lost';

export default function HangmanGame() {
  const { dispatch } = useUser();
  const [gameState, setGameState] = useState<GameState>('select');
  const [category, setCategory] = useState<VocabularyCategory | null>(null);
  const [word, setWord] = useState<VocabularyWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const MAX_WRONG = 6;

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const startGame = useCallback((cat: VocabularyCategory) => {
    setCategory(cat);
    const randomWord = cat.words[Math.floor(Math.random() * cat.words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState('playing');
  }, []);

  const guessLetter = useCallback((letter: string) => {
    if (!word || gameState !== 'playing') return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.en.toLowerCase().includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= MAX_WRONG) {
        setGameState('lost');
        dispatch({ type: 'WRONG_ANSWER' });
        dispatch({ type: 'GAME_PLAYED' });
      }
    } else {
      const allFound = word.en.toLowerCase().split('').every(
        (l) => l === ' ' || l === '-' || newGuessed.has(l)
      );
      if (allFound) {
        setGameState('won');
        dispatch({ type: 'ADD_XP', payload: 10 + (MAX_WRONG - wrongGuesses) * 2 });
        dispatch({ type: 'CORRECT_ANSWER', payload: word.en });
        dispatch({ type: 'GAME_PLAYED' });
      }
    }
  }, [word, gameState, guessedLetters, wrongGuesses, dispatch]);

  const playAgain = () => {
    if (category) startGame(category);
  };

  // Category Selection
  if (gameState === 'select') {
    return (
      <div>
        <Link to="/games" className="back-link">← Juegos</Link>
        <h1 className="page-title animate-fade-in">🪢 Ahorcado</h1>
        <p className="page-subtitle animate-fade-in">Elige una categoría para comenzar</p>

        <div className="games-grid">
          {vocabularyCategories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => startGame(cat)}
              className={`card card-interactive animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div className="game-card">
                <div className="game-card-icon" style={{ background: 'var(--color-primary)' }}>
                  {cat.icon}
                </div>
                <div className="game-card-info">
                  <div className="game-card-name">{cat.nameEs}</div>
                  <div className="game-card-desc">{cat.words.length} palabras</div>
                </div>
                <div className="game-card-arrow">→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!word) return null;

  const displayWord = word.en
    .toLowerCase()
    .split('')
    .map((letter) => {
      if (letter === ' ') return '  ';
      if (letter === '-') return '-';
      return guessedLetters.has(letter) ? letter : '_';
    });

  const hangmanParts = [
    // head
    <circle key="head" cx="200" cy="80" r="20" stroke="var(--text-primary)" strokeWidth="3" fill="none" />,
    // body
    <line key="body" x1="200" y1="100" x2="200" y2="160" stroke="var(--text-primary)" strokeWidth="3" />,
    // left arm
    <line key="larm" x1="200" y1="120" x2="170" y2="145" stroke="var(--text-primary)" strokeWidth="3" />,
    // right arm
    <line key="rarm" x1="200" y1="120" x2="230" y2="145" stroke="var(--text-primary)" strokeWidth="3" />,
    // left leg
    <line key="lleg" x1="200" y1="160" x2="175" y2="200" stroke="var(--text-primary)" strokeWidth="3" />,
    // right leg
    <line key="rleg" x1="200" y1="160" x2="225" y2="200" stroke="var(--text-primary)" strokeWidth="3" />,
  ];

  return (
    <div className="hangman-container">
      <Link to="/games" className="back-link">← Juegos</Link>

      <div className="hangman-header animate-fade-in">
        <div className="hangman-category">
          <span>{category?.icon}</span> {category?.nameEs}
        </div>
        <div className="hangman-lives">
          {Array.from({ length: MAX_WRONG }).map((_, i) => (
            <span key={i} className={`hangman-heart ${i < (MAX_WRONG - wrongGuesses) ? '' : 'hangman-heart-lost'}`}>
              {i < (MAX_WRONG - wrongGuesses) ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Hangman SVG */}
      <div className="hangman-drawing animate-fade-in-scale">
        <svg viewBox="100 0 200 220" width="200" height="220">
          {/* gallows */}
          <line x1="130" y1="210" x2="270" y2="210" stroke="var(--text-muted)" strokeWidth="3" />
          <line x1="150" y1="210" x2="150" y2="30" stroke="var(--text-muted)" strokeWidth="3" />
          <line x1="150" y1="30" x2="200" y2="30" stroke="var(--text-muted)" strokeWidth="3" />
          <line x1="200" y1="30" x2="200" y2="60" stroke="var(--text-muted)" strokeWidth="3" />
          {/* body parts */}
          {hangmanParts.slice(0, wrongGuesses)}
        </svg>
      </div>

      {/* Hint */}
      <div className="hangman-hint animate-fade-in">
        💡 <span>{word.es}</span>
      </div>

      {/* Word Display */}
      <div className="hangman-word animate-fade-in">
        {displayWord.map((letter, i) => (
          <span
            key={i}
            className={`hangman-letter ${letter !== '_' ? 'hangman-letter-found' : ''} ${gameState === 'won' ? 'animate-bounce' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Result */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className={`hangman-result animate-fade-in-scale ${gameState === 'won' ? 'hangman-result-won' : 'hangman-result-lost'}`}>
          <div className="hangman-result-icon">
            {gameState === 'won' ? '🎉' : '😢'}
          </div>
          <div className="hangman-result-text">
            {gameState === 'won' ? '¡Excelente!' : `La palabra era: ${word.en}`}
          </div>
          {gameState === 'won' && (
            <div className="hangman-result-xp">+{10 + (MAX_WRONG - wrongGuesses) * 2} XP</div>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <button onClick={playAgain} className="btn btn-primary">
              Jugar de nuevo
            </button>
            <button onClick={() => setGameState('select')} className="btn btn-secondary">
              Otra categoría
            </button>
          </div>
        </div>
      )}

      {/* Keyboard */}
      {gameState === 'playing' && (
        <div className="hangman-keyboard animate-fade-in-up">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = isGuessed && word.en.toLowerCase().includes(letter);
            const isWrong = isGuessed && !word.en.toLowerCase().includes(letter);
            return (
              <button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={isGuessed}
                className={`hangman-key ${isCorrect ? 'hangman-key-correct' : ''} ${isWrong ? 'hangman-key-wrong' : ''}`}
              >
                {letter.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
