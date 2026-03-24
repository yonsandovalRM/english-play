import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { phraseStructures } from '../../data/phrases';
import type { PhraseStructure, Phrase } from '../../types';

type GameState = 'select' | 'playing' | 'answered' | 'finished';

export default function FillBlankGame() {
  const { dispatch } = useUser();
  const [gameState, setGameState] = useState<GameState>('select');
  const [structure, setStructure] = useState<PhraseStructure | null>(null);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  const ROUND_SIZE = 8;

  const startGame = useCallback((s: PhraseStructure) => {
    setStructure(s);
    const shuffled = [...s.phrases].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    setPhrases(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTotalXp(0);
    setGameState('playing');
  }, []);

  const currentPhrase = useMemo(() => phrases[currentIndex], [phrases, currentIndex]);

  const shuffledOptions = useMemo(() => {
    if (!currentPhrase?.options) return [];
    return [...currentPhrase.options].sort(() => Math.random() - 0.5);
  }, [currentPhrase]);

  const handleSelect = useCallback((option: string) => {
    if (gameState !== 'playing' || selectedOption) return;
    setSelectedOption(option);
    setGameState('answered');

    const isCorrect = option === currentPhrase.blank;
    if (isCorrect) {
      const xp = 10;
      setScore((s) => s + 1);
      setTotalXp((x) => x + xp);
      dispatch({ type: 'ADD_XP', payload: xp });
      dispatch({ type: 'CORRECT_ANSWER', payload: currentPhrase.blank });
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
    }
  }, [gameState, selectedOption, currentPhrase, dispatch]);

  const nextPhrase = () => {
    if (currentIndex + 1 >= phrases.length) {
      dispatch({ type: 'GAME_PLAYED' });
      setGameState('finished');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setGameState('playing');
    }
  };

  // Category selection
  if (gameState === 'select') {
    return (
      <div>
        <Link to="/games" className="back-link">← Juegos</Link>
        <h1 className="page-title animate-fade-in">📝 Completar la Frase</h1>
        <p className="page-subtitle animate-fade-in">Elige una estructura para practicar</p>

        <div className="games-grid">
          {phraseStructures.map((s, i) => (
            <button
              key={s.id}
              onClick={() => startGame(s)}
              className={`card card-interactive animate-fade-in-up stagger-${i + 1}`}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div className="game-card">
                <div className="game-card-icon" style={{ background: 'var(--color-secondary)' }}>
                  {s.icon}
                </div>
                <div className="game-card-info">
                  <div className="game-card-name">{s.name}</div>
                  <div className="game-card-desc">{s.description}</div>
                </div>
                <div className="game-card-arrow">→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Final results
  if (gameState === 'finished') {
    const percent = Math.round((score / phrases.length) * 100);
    return (
      <div className="fill-blank-container" style={{ textAlign: 'center' }}>
        <Link to="/games" className="back-link">← Juegos</Link>

        <div className="animate-fade-in-scale" style={{ paddingTop: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>
            {percent >= 80 ? '🏆' : percent >= 50 ? '👏' : '💪'}
          </div>
          <h2 className="page-title">¡Ronda completada!</h2>
          <p className="page-subtitle">
            {score} de {phrases.length} correctas ({percent}%)
          </p>

          <div className="card" style={{ display: 'inline-block', padding: 'var(--space-lg) var(--space-xl)', margin: 'var(--space-lg) 0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-xp)', fontFamily: 'var(--font-display)' }}>
              +{totalXp} XP
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => startGame(structure!)} className="btn btn-primary btn-lg">
              Jugar de nuevo
            </button>
            <button onClick={() => setGameState('select')} className="btn btn-secondary btn-lg">
              Otra estructura
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPhrase) return null;

  const isCorrect = selectedOption === currentPhrase.blank;

  return (
    <div className="fill-blank-container">
      <Link to="/games" className="back-link">← Juegos</Link>

      {/* Progress */}
      <div className="fill-blank-progress animate-fade-in">
        <div className="fill-blank-progress-info">
          <span>{structure?.icon} {structure?.name}</span>
          <span>{currentIndex + 1} / {phrases.length}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Sentence */}
      <div className="fill-blank-sentence animate-fade-in-scale" key={currentIndex}>
        <div className="fill-blank-english">
          {currentPhrase.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className={`fill-blank-blank ${selectedOption ? (isCorrect ? 'fill-blank-blank-correct' : 'fill-blank-blank-wrong') : ''}`}>
                  {selectedOption || '______'}
                </span>
              )}
            </span>
          ))}
        </div>
        <div className="fill-blank-translation">
          {currentPhrase.translation}
        </div>
      </div>

      {/* Options */}
      <div className="fill-blank-options" key={`opts-${currentIndex}`}>
        {shuffledOptions.map((option, i) => {
          let optionClass = 'fill-blank-option';
          if (selectedOption) {
            if (option === currentPhrase.blank) optionClass += ' fill-blank-option-correct';
            else if (option === selectedOption) optionClass += ' fill-blank-option-wrong';
            else optionClass += ' fill-blank-option-disabled';
          }
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`${optionClass} animate-fade-in-up stagger-${i + 1}`}
              disabled={!!selectedOption}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {gameState === 'answered' && (
        <div className={`fill-blank-feedback animate-fade-in-scale ${isCorrect ? 'fill-blank-feedback-correct' : 'fill-blank-feedback-wrong'}`}>
          <div className="fill-blank-feedback-icon">
            {isCorrect ? '✅' : '❌'}
          </div>
          <div className="fill-blank-feedback-text">
            {isCorrect
              ? '¡Correcto! +10 XP'
              : `Incorrecto. La respuesta era: ${currentPhrase.blank}`}
          </div>
          <button onClick={nextPhrase} className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
            {currentIndex + 1 >= phrases.length ? 'Ver resultados' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
