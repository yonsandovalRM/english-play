
import React from 'react';
import './Hangman.css';

interface HangmanIllustrationProps {
  wrongGuesses: number;
  isLost: boolean;
  isShaking: boolean;
}

const HangmanIllustration: React.FC<HangmanIllustrationProps> = ({ wrongGuesses, isLost, isShaking }) => {
  return (
    <div className={`hangman-svg-wrapper ${isShaking ? 'shake-animation' : ''}`}>
      <svg viewBox="90 0 220 230" className="hangman-svg-element">
        {/* Platform */}
        <line x1="120" y1="215" x2="280" y2="215" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
        {/* Pole */}
        <line x1="150" y1="215" x2="150" y2="25" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
        {/* Top bar */}
        <line x1="145" y1="28" x2="205" y2="28" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
        {/* Rope */}
        <line x1="200" y1="28" x2="200" y2="52" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />
        {/* Brace */}
        <line x1="150" y1="60" x2="175" y2="28" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" />

        {/* Body parts with animations */}
        {wrongGuesses >= 1 && (
          <g className="hangman-part">
            <circle cx="200" cy="72" r="18" stroke="var(--color-secondary)" strokeWidth="3" fill="none" />
            {isLost && (
              <>
                <line x1="193" y1="68" x2="197" y2="72" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                <line x1="197" y1="68" x2="193" y2="72" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                <line x1="203" y1="68" x2="207" y2="72" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                <line x1="207" y1="68" x2="203" y2="72" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" />
                <path d="M192 80 Q200 85 208 80" stroke="var(--color-secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}
            {!isLost && (
              <>
                <circle cx="194" cy="70" r="1.5" fill="var(--color-secondary)" />
                <circle cx="206" cy="70" r="1.5" fill="var(--color-secondary)" />
              </>
            )}
          </g>
        )}
        {wrongGuesses >= 2 && (
          <line x1="200" y1="90" x2="200" y2="150" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" className="hangman-part" />
        )}
        {wrongGuesses >= 3 && (
          <line x1="200" y1="110" x2="172" y2="138" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" className="hangman-part" />
        )}
        {wrongGuesses >= 4 && (
          <line x1="200" y1="110" x2="228" y2="138" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" className="hangman-part" />
        )}
        {wrongGuesses >= 5 && (
          <line x1="200" y1="150" x2="178" y2="190" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" className="hangman-part" />
        )}
        {wrongGuesses >= 6 && (
          <line x1="200" y1="150" x2="222" y2="190" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" className="hangman-part" />
        )}
      </svg>
    </div>
  );
};

export default HangmanIllustration;
