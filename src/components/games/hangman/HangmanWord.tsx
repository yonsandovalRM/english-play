
import React from 'react';
import './Hangman.css';

interface HangmanWordProps {
  wordEn: string;
  guessedLetters: Set<string>;
  gameState: 'playing' | 'won' | 'lost';
}

const HangmanWord: React.FC<HangmanWordProps> = ({ wordEn, guessedLetters, gameState }) => {
  return (
    <div className="word-display-container">
      {wordEn.toLowerCase().split('').map((letter, i) => {
        if (letter === ' ') return <div key={i} className="word-space" />;
        if (letter === '-') return <span key={i} className="word-dash">-</span>;

        const isRevealed = guessedLetters.has(letter) || gameState === 'lost';
        const isLostReveal = gameState === 'lost' && !guessedLetters.has(letter);

        return (
          <div
            key={i}
            className={`letter-slot ${isRevealed ? 'letter-revealed' : ''}`}
          >
            <span className={`letter-text 
              ${isRevealed ? 'letter-visible' : ''} 
              ${isLostReveal ? 'letter-lost-reveal' : ''}
            `}>
              {isRevealed ? letter.toUpperCase() : ''}
            </span>
            <div className="letter-underline" />
          </div>
        );
      })}
    </div>
  );
};

export default HangmanWord;
