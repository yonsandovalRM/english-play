import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { phraseStructures } from '../../data/phrases';
import { Card, CardContent } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import type { PhraseStructure, Phrase } from '../../types';

type GameState = 'select' | 'playing' | 'answered' | 'finished';

const structureColors = [
  'linear-gradient(135deg, #6C63FF, #4834D4)',
  'linear-gradient(135deg, #FF6584, #D44E6B)',
  'linear-gradient(135deg, #00C896, #00A37A)',
  'linear-gradient(135deg, #FF9F43, #EE5253)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
];

const ROUND_SIZE = 8;
const optionLetters = ['A', 'B', 'C', 'D'];

export default function FillBlankGame() {
  const { dispatch } = useUser();
  const [gameState, setGameState] = useState<GameState>('select');
  const [structure, setStructure] = useState<PhraseStructure | null>(null);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  const startGame = useCallback((s: PhraseStructure) => {
    setStructure(s);
    const shuffled = [...s.phrases].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
    setPhrases(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTotalXp(0);
    setGameState('playing');
  }, []);

  const currentPhrase = useMemo(() => phrases[currentIndex], [phrases, currentIndex]);

  const shuffledOptions = useMemo(() => {
    if (!currentPhrase?.options) return [];
    return [...currentPhrase.options].sort(() => Math.random() - 0.5);
  }, [currentPhrase]);

  const handleSelect = useCallback((option: string) => {
    if (gameState !== 'playing' || selectedOption) return;
    setSelectedOption(option);
    setGameState('answered');
    const isCorrect = option === currentPhrase.blank;
    if (isCorrect) {
      setScore((s) => s + 1);
      setTotalXp((x) => x + 10);
      dispatch({ type: 'ADD_XP', payload: 10 });
      dispatch({ type: 'CORRECT_ANSWER', payload: currentPhrase.blank });
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
    }
  }, [gameState, selectedOption, currentPhrase, dispatch]);

  const nextPhrase = () => {
    if (currentIndex + 1 >= phrases.length) {
      dispatch({ type: 'GAME_PLAYED' });
      setGameState('finished');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setGameState('playing');
    }
  };

  // ── BACK LINK ────────────────────────────────────────────────────────
  const BackLink = ({ to = '/games', label = 'Juegos' }) => (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 mb-5"
    >
      <ChevronLeft size={18} />
      {label}
    </Link>
  );

  // ── SELECT ───────────────────────────────────────────────────────────
  if (gameState === 'select') {
    return (
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4">
        <BackLink label="Volver a Juegos" />

        <div className="text-center mb-4">
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-3xl font-black font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
            Completar la Frase
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Elige una estructura gramatical para practicar
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {phraseStructures.map((s, i) => (
            <button
              key={s.id}
              onClick={() => startGame(s)}
              className="w-full text-left outline-none group"
            >
              <Card className="border-white/5 hover:border-primary/30 transition-all duration-250 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                    style={{ background: structureColors[i % structureColors.length] }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base font-display text-foreground">{s.name}</div>
                    <div className="text-sm text-muted-foreground mt-0.5 leading-snug">{s.description}</div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                  />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── FINISHED ─────────────────────────────────────────────────────────
  if (gameState === 'finished') {
    const percent = Math.round((score / phrases.length) * 100);
    const emoji = percent >= 80 ? '🏆' : percent >= 50 ? '🎉' : '💪';
    const message = percent >= 80 ? '¡Excelente!' : percent >= 50 ? '¡Bien hecho!' : '¡Sigue practicando!';
    const circumference = 2 * Math.PI * 50;

    return (
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4">
        <BackLink />

        <div className="flex flex-col items-center text-center pt-6 gap-4">
          <div className="text-7xl animate-bounce">{emoji}</div>
          <h2 className="text-3xl font-black font-display">{message}</h2>
          <p className="text-muted-foreground">Ronda completada</p>

          {/* Score ring */}
          <div className="relative w-40 h-40 my-2">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#grad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - percent / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00C896" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-display">{percent}%</span>
              <span className="text-sm text-muted-foreground font-semibold">{score}/{phrases.length}</span>
            </div>
          </div>

          {totalXp > 0 && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-bold text-lg">
              <span>⭐</span>
              <span>+{totalXp} XP ganados</span>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
            <button
              onClick={() => startGame(structure!)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] text-white font-bold text-base shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              🔄 Jugar de nuevo
            </button>
            <button
              onClick={() => setGameState('select')}
              className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 text-secondary-foreground font-semibold hover:bg-white/10 transition-all"
            >
              📂 Otra estructura
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────
  if (!currentPhrase) return null;
  const isCorrect = selectedOption === currentPhrase.blank;
  const progressPercent = ((currentIndex + 1) / phrases.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4">
      <BackLink />

      {/* Progress header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-muted-foreground">{structure?.icon} {structure?.name}</span>
          <span className="text-foreground">
            {currentIndex + 1}
            <span className="text-muted-foreground"> / {phrases.length}</span>
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
        {/* Step dots */}
        <div className="flex gap-1 justify-center mt-1">
          {phrases.map((_, i) => (
            <div
              key={i}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i < currentIndex
                  ? 'w-3.5 bg-emerald-500'
                  : i === currentIndex
                    ? 'w-[18px] bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]'
                    : 'w-1.5 bg-white/10',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Sentence card */}
      <Card key={currentIndex} className="border-white/[0.06] bg-[var(--bg-card)] shadow-xl">
        <CardContent className="p-7">
          <p className="text-xl font-semibold leading-relaxed text-foreground font-display mb-4">
            {currentPhrase.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={[
                    'inline-block min-w-[80px] px-3 py-0.5 rounded-xl font-extrabold mx-1 text-center align-baseline transition-all',
                    !selectedOption
                      ? 'bg-primary/12 border-2 border-dashed border-primary/40 text-primary tracking-widest'
                      : isCorrect
                        ? 'bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400'
                        : 'bg-red-500/12 border-2 border-red-500/30 text-red-400 line-through',
                  ].join(' ')}>
                    {selectedOption || '______'}
                  </span>
                )}
              </span>
            ))}
          </p>
          <p className="text-sm text-muted-foreground border-t border-white/5 pt-3 leading-relaxed">
            🇪🇸 {currentPhrase.translation}
          </p>
        </CardContent>
      </Card>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3" key={`opts-${currentIndex}`}>
        {shuffledOptions.map((option, i) => {
          const isThisCorrect = option === currentPhrase.blank;
          const isThisSelected = option === selectedOption;
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selectedOption}
              className={[
                'flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-left',
                'border-[1.5px] transition-all duration-200 outline-none',
                !selectedOption
                  ? 'bg-[var(--bg-card)] border-white/7 text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:bg-[var(--bg-card-hover)] hover:shadow-lg cursor-pointer'
                  : isThisCorrect
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_4px_14px_rgba(0,200,150,0.2)]'
                    : isThisSelected
                      ? 'bg-red-500/8 border-red-500 text-red-400 opacity-80'
                      : 'bg-[var(--bg-card)] border-white/5 text-muted-foreground opacity-35 cursor-not-allowed',
              ].join(' ')}
            >
              <span className={[
                'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 transition-all',
                !selectedOption
                  ? 'bg-white/7 text-muted-foreground'
                  : isThisCorrect
                    ? 'bg-emerald-500 text-white'
                    : isThisSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-muted-foreground',
              ].join(' ')}>
                {optionLetters[i]}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {gameState === 'answered' && (
        <div className={[
          'flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all',
          isCorrect
            ? 'bg-emerald-500/10 border-emerald-500/25'
            : 'bg-red-500/8 border-red-500/20',
        ].join(' ')}>
          <div className="flex items-center gap-3 flex-1">
            {isCorrect
              ? <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              : <XCircle className="text-red-400 shrink-0" size={24} />
            }
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm text-foreground">
                {isCorrect ? '¡Correcto! +10 XP' : 'Incorrecto'}
              </span>
              {!isCorrect && (
                <span className="text-xs text-muted-foreground">
                  Respuesta correcta: <strong className="text-foreground">{currentPhrase.blank}</strong>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={nextPhrase}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm shrink-0 shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            {currentIndex + 1 >= phrases.length ? 'Resultados' : 'Siguiente'}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
