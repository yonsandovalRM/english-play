import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vocabularyCategories } from '../data/vocabulary';
import { phraseStructures } from '../data/phrases';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const categoryColors = [
  'linear-gradient(135deg, #6C63FF, #4834D4)',
  'linear-gradient(135deg, #FF6584, #D44E6B)',
  'linear-gradient(135deg, #00C896, #00A37A)',
  'linear-gradient(135deg, #FF9F43, #EE5253)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

const phraseColors = [
  'linear-gradient(135deg, #00C896, #00A37A)',
  'linear-gradient(135deg, #6C63FF, #4834D4)',
  'linear-gradient(135deg, #FF9F43, #EE5253)',
  'linear-gradient(135deg, #FF6584, #D44E6B)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
];

export default function Vocabulary() {
  const { progress } = useUser();
  const [tab, setTab] = useState<'words' | 'phrases'>('words');

  const learnedSet = new Set(progress.wordsLearned);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black font-display text-foreground">📚 Vocabulario</h1>
        <p className="text-muted-foreground text-sm mt-1">Explora palabras y frases por categoría</p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[var(--bg-card)] border border-white/5 rounded-2xl p-3 text-center">
          <div className="text-xl font-black text-[var(--color-primary)]">{progress.wordsLearned.length}</div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Aprendidas</div>
        </div>
        <div className="flex-1 bg-[var(--bg-card)] border border-white/5 rounded-2xl p-3 text-center">
          <div className="text-xl font-black text-foreground">
            {vocabularyCategories.reduce((t, c) => t + c.words.length, 0)}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Total palabras</div>
        </div>
        <div className="flex-1 bg-[var(--bg-card)] border border-white/5 rounded-2xl p-3 text-center">
          <div className="text-xl font-black text-foreground">{vocabularyCategories.length}</div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Categorías</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-white/5">
        {(['words', 'phrases'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2 rounded-lg text-sm font-bold transition-all',
              tab === t
                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {t === 'words' ? '🔤 Palabras' : '💬 Frases'}
          </button>
        ))}
      </div>

      {/* Word Categories */}
      {tab === 'words' && (
        <div className="flex flex-col gap-3">
          {vocabularyCategories.map((cat, i) => {
            const learned = cat.words.filter(w => learnedSet.has(w.en)).length;
            const pct = Math.round((learned / cat.words.length) * 100);
            return (
              <Link key={cat.id} to={`/vocabulary/${cat.id}`} className="group">
                <Card className="border-white/5 hover:border-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md"
                      style={{ background: categoryColors[i % categoryColors.length] }}
                    >
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold font-display text-foreground">{cat.nameEs}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{cat.words.length} palabras</div>
                      {/* mini progress */}
                      <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">{pct}%</span>
                      <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Phrase Structures */}
      {tab === 'phrases' && (
        <div className="flex flex-col gap-3">
          {phraseStructures.map((s, i) => (
            <Link key={s.id} to={`/vocabulary/phrases/${s.id}`} className="group">
              <Card className="border-white/5 hover:border-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md"
                    style={{ background: phraseColors[i % phraseColors.length] }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold font-display text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{s.phrases.length} frases</div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
