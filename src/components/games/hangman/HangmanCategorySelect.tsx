
import React from 'react';
import { Link } from 'react-router-dom';
import { vocabularyCategories } from '../../../data/vocabulary';
import type { VocabularyCategory } from '../../../types';
import './Hangman.css';

interface HangmanCategorySelectProps {
  onSelect: (cat: VocabularyCategory, index: number) => void;
}

const categoryColors = [
  'linear-gradient(135deg, #6C63FF, #4834D4)',
  'linear-gradient(135deg, #FF6584, #D44E6B)',
  'linear-gradient(135deg, #00C896, #00A37A)',
  'linear-gradient(135deg, #FF9F43, #EE5253)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
];

const HangmanCategorySelect: React.FC<HangmanCategorySelectProps> = ({ onSelect }) => {
  return (
    <div className="hangman-container">
      <Link to="/games" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a Juegos
      </Link>

      <div className="header-section">
        <span className="title-icon">🪢</span>
        <h1 className="hangman-title">Ahorcado</h1>
        <p className="hangman-subtitle">Adivina la palabra letra por letra antes de que se complete la figura</p>
      </div>

      <div className="categories-grid">
        {vocabularyCategories.map((cat, i) => {
          const color = categoryColors[i % categoryColors.length];
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat, i)}
              className="category-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="category-icon-wrapper" style={{ background: color }}>
                <span>{cat.icon}</span>
              </div>
              <div className="category-info">
                <span className="category-name">{cat.nameEs}</span>
                <span className="category-count">{cat.words.length} palabras</span>
              </div>
              <div className="category-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HangmanCategorySelect;
