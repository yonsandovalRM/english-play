import { Link } from 'react-router-dom';
import { vocabularyCategories } from '../data/vocabulary';
import { phraseStructures } from '../data/phrases';

export default function Vocabulary() {
  return (
    <div>
      <h1 className="page-title animate-fade-in">📚 Vocabulario</h1>
      <p className="page-subtitle animate-fade-in">Explora palabras y frases por categoría</p>

      {/* Word Categories */}
      <div className="section-header">
        <h3 className="section-title">🔤 Palabras</h3>
      </div>
      <div className="games-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {vocabularyCategories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/vocabulary/${cat.id}`}
            className={`card card-interactive animate-fade-in-up stagger-${i + 1}`}
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
          </Link>
        ))}
      </div>

      {/* Phrase Structures */}
      <div className="section-header">
        <h3 className="section-title">💬 Frases</h3>
      </div>
      <div className="games-grid">
        {phraseStructures.map((structure, i) => (
          <Link
            key={structure.id}
            to={`/vocabulary/phrases/${structure.id}`}
            className={`card card-interactive animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="game-card">
              <div className="game-card-icon" style={{ background: 'var(--color-secondary)' }}>
                {structure.icon}
              </div>
              <div className="game-card-info">
                <div className="game-card-name">{structure.name}</div>
                <div className="game-card-desc">{structure.description}</div>
              </div>
              <div className="game-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
