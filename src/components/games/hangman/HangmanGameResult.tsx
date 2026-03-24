
import React from 'react';
import './Hangman.css';

interface HangmanGameResultProps {
  gameState: 'won' | 'lost';
  wordEn: string;
  xpEarned: number;
  onPlayAgain: () => void;
  onAnotherCategory: () => void;
}

const HangmanGameResult: React.FC<HangmanGameResultProps> = ({ 
  gameState, 
  wordEn, 
  xpEarned, 
  onPlayAgain, 
  onAnotherCategory 
}) => {
  return (
    <div className="result-overlay">
      <div className="result-card">
        <div className="result-emoji">
          {gameState === 'won' ? '🎉' : '💀'}
        </div>
        <h2 className="result-title">
          {gameState === 'won' ? '¡Palabra encontrada!' : '¡Oh no!'}
        </h2>
        <p className="result-subtitle">
          {gameState === 'won'
            ? `Adivinaste "${wordEn}" correctamente`
            : `La palabra era "${wordEn}"`
          }
        </p>
        {gameState === 'won' && (
          <div className="xp-badge">
            <span className="xp-icon">⭐</span>
            +{xpEarned} XP
          </div>
        )}
        <div className="result-actions">
          <button onClick={onPlayAgain} className="btn-primary">
            🔄 Jugar de nuevo
          </button>
          <button onClick={onAnotherCategory} className="btn-secondary">
            📚 Otra categoría
          </button>
        </div>
      </div>
    </div>
  );
};

export default HangmanGameResult;
