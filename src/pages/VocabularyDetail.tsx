import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vocabularyCategories } from '../data/vocabulary';
import { useUser } from '../context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Volume2 } from 'lucide-react';

// Simple flip card component
function WordCard({ en, es, learned }: { en: string; es: string; learned: boolean }) {
  const [flipped, setFlipped] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utt = new SpeechSynthesisUtterance(en);
    utt.lang = 'en-US';
    speechSynthesis.speak(utt);
  };

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '110px',
        }}
      >
        {/* Front */}
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%' }}>
          <Card className={[
            'h-full border transition-all min-h-[110px]',
            learned ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-[var(--bg-card)]',
          ].join(' ')}>
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                {learned && <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-400 px-1.5 py-0">✓ aprendida</Badge>}
                <button
                  onClick={speak}
                  className="ml-auto p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all"
                >
                  <Volume2 size={14} />
                </button>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black font-display text-foreground">{en}</div>
                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">toca para ver traducción</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back */}
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%', transform: 'rotateY(180deg)' }}>
          <Card className="h-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 min-h-[110px]">
            <CardContent className="p-4 h-full flex flex-col items-center justify-center">
              <div className="text-2xl font-black font-display text-[var(--color-primary)]">{es}</div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">traducción al español</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VocabularyDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { progress } = useUser();
  const category = vocabularyCategories.find((c) => c.id === categoryId);
  const [search, setSearch] = useState('');

  if (!category) {
    return (
      <div className="text-center pt-16">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-foreground mb-4">Categoría no encontrada</h2>
        <Link to="/vocabulary" className="text-[var(--color-primary)] font-semibold">← Volver</Link>
      </div>
    );
  }

  const learnedSet = new Set(progress.wordsLearned);
  const filtered = category.words.filter(
    (w) => !search || w.en.includes(search.toLowerCase()) || w.es.includes(search.toLowerCase())
  );
  const learnedCount = category.words.filter(w => learnedSet.has(w.en)).length;
  const pct = Math.round((learnedCount / category.words.length) * 100);

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link to="/vocabulary" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:-translate-x-1">
        <ChevronLeft size={18} />
        Vocabulario
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-xl shadow-primary/20 shrink-0">
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black font-display text-foreground">{category.nameEs}</h1>
          <p className="text-sm text-muted-foreground">{category.words.length} palabras · {learnedCount} aprendidas</p>
          {/* progress bar */}
          <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="text-lg font-black text-[var(--color-primary)] shrink-0">{pct}%</span>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar palabra..."
        className="w-full bg-[var(--bg-card)] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
      />

      {/* Tip */}
      <p className="text-xs text-muted-foreground text-center -mt-2">
        💡 Toca una tarjeta para ver la traducción · 🔊 para escuchar
      </p>

      {/* Word grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((word) => (
          <WordCard
            key={word.en}
            en={word.en}
            es={word.es}
            learned={learnedSet.has(word.en)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-muted-foreground">No se encontraron palabras</div>
        )}
      </div>

      {/* Practice buttons */}
      <div className="flex gap-3 pt-2">
        <Link
          to="/games/hangman"
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] text-white font-bold text-sm text-center shadow-lg hover:-translate-y-0.5 transition-all"
        >
          🪢 Ahorcado
        </Link>
        <Link
          to="/games/match-pairs"
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-bold text-sm text-center shadow-lg hover:-translate-y-0.5 transition-all"
        >
          🔗 Conectar pares
        </Link>
      </div>
    </div>
  );
}
