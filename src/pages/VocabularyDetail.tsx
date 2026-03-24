import { useParams, Link } from 'react-router-dom';
import { vocabularyCategories } from '../data/vocabulary';

export default function VocabularyDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = vocabularyCategories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
        <h2 className="page-title">Categoría no encontrada</h2>
        <Link to="/vocabulary" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/vocabulary" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: 'var(--space-md)' }}>
        ← Vocabulario
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }} className="animate-fade-in">
        <div className="game-card-icon" style={{ background: 'var(--color-primary)', width: 64, height: 64, fontSize: '1.8rem' }}>
          {category.icon}
        </div>
        <div>
          <h1 className="page-title">{category.nameEs}</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>{category.words.length} palabras</p>
        </div>
      </div>

      <div className="vocab-word-list">
        {category.words.map((word, i) => (
          <div key={word.en} className={`card vocab-word-card animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
            <div className="vocab-word-en">{word.en}</div>
            <div className="vocab-word-divider">—</div>
            <div className="vocab-word-es">{word.es}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)' }}>
        <Link to="/games/hangman" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
          🪢 Practicar con Ahorcado
        </Link>
      </div>
    </div>
  );
}
