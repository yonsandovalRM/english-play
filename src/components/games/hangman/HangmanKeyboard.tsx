
import React from 'react';
import './Hangman.css';

interface HangmanKeyboardProps {
  guessedLetters: Set<string>;
  onGuess: (letter: string) => void;
  disabled: boolean;
  wordEn: string;
}

const keyboardRows = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

const HangmanKeyboard: React.FC<HangmanKeyboardProps> = ({ guessedLetters, onGuess, disabled, wordEn }) => {
  return (
    <div className="keyboard-grid">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = isGuessed && wordEn.toLowerCase().includes(letter);
            const isWrong = isGuessed && !wordEn.toLowerCase().includes(letter);

            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={isGuessed || disabled}
                className={`key-button 
                  ${isCorrect ? 'key-correct' : ''} 
                  ${isWrong ? 'key-wrong' : ''} 
                  ${isGuessed ? 'key-disabled' : ''}
                `}
              >
                {letter.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HangmanKeyboard;
