import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { vocabularyCategories } from '../../data/vocabulary';
import { Card, CardContent } from '@/components/ui/card';
import type { VocabularyCategory } from '../../types';

type GameState = 'select' | 'playing' | 'finished';

interface MemoryCard {
  id: string;
  pairId: string;   // same for EN+ES of the same word
  text: string;     // displayed text (uppercase)
  type: 'en' | 'es';
  color: string;    // back-face accent color
}

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

// EN card color  ·  ES card color
const EN_COLOR = '#6C63FF'; // purple
const ES_COLOR = '#00C896'; // green

const PAIR_COUNT = 6;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── 3-D flip card ────────────────────────────────────────────────────
interface FlipCardProps {
  card: MemoryCard;
  state: 'hidden' | 'flipped' | 'matched' | 'wrong';
  onClick: () => void;
  disabled: boolean;
}

function FlipCard({ card, state, onClick, disabled }: FlipCardProps) {
  const isUp = state === 'flipped' || state === 'matched' || state === 'wrong';
  const isEN = card.type === 'en';

  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: '700px' }}
      onClick={disabled ? undefined : onClick}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',         // square
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
          transform: isUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── BACK (face-down) ─ */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1.5px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.8rem', opacity: 0.25 }}>🃏</span>
          </div>
        </div>

        {/* ── FRONT (face-up) ─ */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: state === 'matched'
              ? 'rgba(0,200,150,0.12)'
              : state === 'wrong'
                ? 'rgba(255,71,87,0.12)'
                : isEN
                  ? 'rgba(108,99,255,0.12)'
                  : 'rgba(0,200,150,0.1)',
            border: `1.5px solid ${
              state === 'matched'
                ? 'rgba(0,200,150,0.5)'
                : state === 'wrong'
                  ? 'rgba(255,71,87,0.5)'
                  : isEN
                    ? 'rgba(108,99,255,0.4)'
                    : 'rgba(0,200,150,0.35)'
            }`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            gap: '4px',
          }}>
            {/* Language badge */}
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: state === 'matched' ? '#00C896' : state === 'wrong' ? '#FF4757' : isEN ? EN_COLOR : ES_COLOR,
              opacity: 0.8,
            }}>
              {state === 'matched' ? '✓ PAR' : isEN ? '🇬🇧 EN' : '🇪🇸 ES'}
            </span>
            {/* Word */}
            <span style={{
              fontSize: card.text.length > 8 ? '0.7rem' : card.text.length > 5 ? '0.85rem' : '1rem',
              fontWeight: 900,
              color: state === 'matched'
                ? '#00C896'
                : state === 'wrong'
                  ? '#FF4757'
                  : 'var(--foreground, #f4f4f5)',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '0.03em',
              fontFamily: 'var(--font-display, Outfit, sans-serif)',
            }}>
              {card.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function MatchPairsGame() {
  const { dispatch } = useUser();
  const [gameState, setGameState] = useState<GameState>('select');
  const [category, setCategory] = useState<VocabularyCategory | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);

  // id of the two currently flipped cards
  const [flipped, setFlipped] = useState<string[]>([]);
  // ids of matched pairs
  const [matched, setMatched] = useState<Set<string>>(new Set());
  // ids of the wrong pair (flashing red)
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [locked, setLocked] = useState(false); // prevent rapid clicks during check

  const [moves, setMoves] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, startTime]);

  const startGame = useCallback((cat: VocabularyCategory) => {
    setCategory(cat);
    const words = shuffle(cat.words).slice(0, PAIR_COUNT);
    const newCards: MemoryCard[] = shuffle([
      ...words.map((w, i) => ({
        id: `en-${i}`,
        pairId: w.en,
        text: w.en.toUpperCase(),
        type: 'en' as const,
        color: EN_COLOR,
      })),
      ...words.map((w, i) => ({
        id: `es-${i}`,
        pairId: w.en,       // same pairId as the EN card
        text: w.es.toUpperCase(),
        type: 'es' as const,
        color: ES_COLOR,
      })),
    ]);
    setCards(newCards);
    setFlipped([]);
    setMatched(new Set());
    setWrongPair([]);
    setLocked(false);
    setMoves(0);
    setErrors(0);
    setXpEarned(0);
    setStartTime(Date.now());
    setElapsed(0);
    setGameState('playing');
  }, []);

  const getCardState = (card: MemoryCard): 'hidden' | 'flipped' | 'matched' | 'wrong' => {
    if (matched.has(card.id)) return 'matched';
    if (wrongPair.includes(card.id)) return 'wrong';
    if (flipped.includes(card.id)) return 'flipped';
    return 'hidden';
  };

  const handleCardClick = useCallback((card: MemoryCard) => {
    if (locked) return;
    if (matched.has(card.id)) return;
    if (flipped.includes(card.id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const [idA, idB] = newFlipped;
      const cardA = cards.find((c) => c.id === idA)!;
      const cardB = cards.find((c) => c.id === idB)!;

      const isMatch = cardA.pairId === cardB.pairId && cardA.type !== cardB.type;

      if (isMatch) {
        const newMatched = new Set(matched).add(idA).add(idB);
        setTimeout(() => {
          setMatched(newMatched);
          setFlipped([]);
          setLocked(false);
          dispatch({ type: 'CORRECT_ANSWER', payload: cardA.pairId });

          if (newMatched.size === PAIR_COUNT * 2) {
            const finalElapsed = Math.floor((Date.now() - startTime) / 1000);
            const timeBonus = Math.max(0, 90 - finalElapsed);
            const xp = 20 + timeBonus + Math.max(0, (PAIR_COUNT - errors) * 3);
            setXpEarned(xp);
            dispatch({ type: 'ADD_XP', payload: xp });
            dispatch({ type: 'GAME_PLAYED' });
            setGameState('finished');
          }
        }, 500);
      } else {
        setWrongPair(newFlipped);
        setTimeout(() => {
          setWrongPair([]);
          setFlipped([]);
          setLocked(false);
          setErrors((e) => e + 1);
          dispatch({ type: 'WRONG_ANSWER' });
        }, 1800);
      }
    }
  }, [locked, matched, flipped, cards, errors, startTime, dispatch]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const BackLink = () => (
    <Link to="/games" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 mb-2">
      <ChevronLeft size={18} /> Juegos
    </Link>
  );

  // ── SELECT ─────────────────────────────────────────────────────────────
  if (gameState === 'select') {
    return (
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-5">
        <BackLink />
        <div className="text-center mb-2">
          <div className="text-5xl mb-3">🃏</div>
          <h1 className="text-3xl font-black font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
            Memory de Pares
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-sm">
            Voltea las cartas y empareja cada palabra en español con su par en inglés
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-3 justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-xs font-bold text-[#6C63FF]">
            🇬🇧 INGLÉS
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C896]/15 border border-[#00C896]/30 text-xs font-bold text-[#00C896]">
            🇪🇸 ESPAÑOL
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {vocabularyCategories.map((cat, i) => (
            <button key={cat.id} onClick={() => startGame(cat)} className="text-left group outline-none">
              <Card className="border-white/5 hover:border-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md" style={{ background: categoryColors[i % categoryColors.length] }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold font-display text-foreground">{cat.nameEs}</div>
                    <div className="text-xs text-muted-foreground">{PAIR_COUNT} pares · {cat.words.length} palabras disponibles</div>
                  </div>
                  <ChevronLeft size={16} className="rotate-180 text-muted-foreground/40 group-hover:text-primary transition-all shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── FINISHED ────────────────────────────────────────────────────────────
  if (gameState === 'finished') {
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
    return (
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-5">
        <BackLink />
        <div className="flex flex-col items-center text-center gap-4 pt-4">
          <div className="text-5xl mb-1">{'⭐'.repeat(stars)}{'🌑'.repeat(3 - stars)}</div>
          <h2 className="text-3xl font-black font-display text-foreground">¡Completado!</h2>
          <p className="text-muted-foreground text-sm">{category?.nameEs} — {PAIR_COUNT} pares encontrados</p>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {[
              { label: 'Tiempo', value: formatTime(elapsed), icon: '⏱️' },
              { label: 'Intentos', value: moves, icon: '🎯' },
              { label: 'Errores', value: errors, icon: errors === 0 ? '🥇' : '❌' },
            ].map(({ label, value, icon }) => (
              <Card key={label} className="border-white/5 bg-[var(--bg-card)]">
                <CardContent className="p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-lg font-black font-display text-foreground">{value}</div>
                  <div className="text-[10px] text-muted-foreground">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-bold text-lg">
            ⭐ +{xpEarned} XP
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => category && startGame(category)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all"
            >
              🔄 Jugar de nuevo
            </button>
            <button
              onClick={() => setGameState('select')}
              className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-secondary-foreground font-semibold hover:bg-white/10 transition-all"
            >
              📂 Otra categoría
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────
  const pairsLeft = PAIR_COUNT - matched.size / 2;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <BackLink />
        <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
          <span>⏱️ {formatTime(elapsed)}</span>
          <span>🎯 {moves}</span>
          <span className={errors > 0 ? 'text-red-400' : 'text-muted-foreground'}>❌ {errors}</span>
        </div>
      </div>

      {/* Category + progress */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-muted-foreground">{category?.icon} {category?.nameEs}</span>
          <span className="text-foreground">{PAIR_COUNT - pairsLeft}/{PAIR_COUNT} pares</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${((PAIR_COUNT - pairsLeft) / PAIR_COUNT) * 100}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 justify-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/25 text-[10px] font-bold text-[#6C63FF]">
          🇬🇧 INGLÉS
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00C896]/15 border border-[#00C896]/25 text-[10px] font-bold text-[#00C896]">
          🇪🇸 ESPAÑOL
        </div>
      </div>

      {/* 4 × 3 grid */}
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        {cards.map((card) => {
          const st = getCardState(card);
          const isDisabled = locked || matched.has(card.id) || flipped.includes(card.id) || flipped.length === 2;
          return (
            <FlipCard
              key={card.id}
              card={card}
              state={st}
              onClick={() => handleCardClick(card)}
              disabled={isDisabled}
            />
          );
        })}
      </div>
    </div>
  );
}
