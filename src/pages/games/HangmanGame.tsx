import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { vocabularyCategories } from '../../data/vocabulary';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { VocabularyCategory, VocabularyWord } from '../../types';

type GameState = 'select' | 'playing' | 'won' | 'lost';

const MAX_WRONG = 6;

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

const keyboardRows = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

// ── Confetti ─────────────────────────────────────────────────────────
function Confetti() {
  const colors = ['#6C63FF', '#FF6584', '#00C896', '#FF9F43', '#4facfe', '#f093fb', '#FFD700'];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    color: colors[i % colors.length],
    size: 8 + Math.random() * 10,
    circle: Math.random() > 0.5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-20px',
            width: p.circle ? `${p.size}px` : `${p.size * 0.7}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.circle ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes confetti-fall { 0% { transform: translateY(-100px) rotate(0deg); opacity:1; } 100% { transform: translateY(100vh) rotate(720deg); opacity:0; } }`}</style>
    </div>
  );
}

// ── Hangman SVG ───────────────────────────────────────────────────────
function HangmanIllustration({ wrongGuesses, isLost, isShaking }: {
  wrongGuesses: number; isLost: boolean; isShaking: boolean;
}) {
  return (
    <div className={isShaking ? 'animate-[shake_0.4s_ease]' : ''}>
      <svg viewBox="90 0 220 230" className="w-[180px] h-[200px] drop-shadow-xl">
        <line x1="120" y1="215" x2="280" y2="215" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="215" x2="150" y2="25" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
        <line x1="145" y1="28" x2="205" y2="28" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
        <line x1="200" y1="28" x2="200" y2="52" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
        <line x1="150" y1="60" x2="175" y2="28" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
        {wrongGuesses >= 1 && (
          <g style={{ animation: 'hangman-appear 0.4s ease' }}>
            <circle cx="200" cy="72" r="18" stroke="#FF6584" strokeWidth="3" fill="none" />
            {isLost ? (
              <>
                <line x1="193" y1="68" x2="197" y2="72" stroke="#FF6584" strokeWidth="2" strokeLinecap="round" />
                <line x1="197" y1="68" x2="193" y2="72" stroke="#FF6584" strokeWidth="2" strokeLinecap="round" />
                <line x1="203" y1="68" x2="207" y2="72" stroke="#FF6584" strokeWidth="2" strokeLinecap="round" />
                <line x1="207" y1="68" x2="203" y2="72" stroke="#FF6584" strokeWidth="2" strokeLinecap="round" />
                <path d="M192 80 Q200 76 208 80" stroke="#FF6584" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="194" cy="70" r="2" fill="#FF6584" />
                <circle cx="206" cy="70" r="2" fill="#FF6584" />
              </>
            )}
          </g>
        )}
        {wrongGuesses >= 2 && <line x1="200" y1="90" x2="200" y2="150" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" style={{ animation: 'hangman-appear 0.4s ease' }} />}
        {wrongGuesses >= 3 && <line x1="200" y1="110" x2="172" y2="138" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" style={{ animation: 'hangman-appear 0.4s ease' }} />}
        {wrongGuesses >= 4 && <line x1="200" y1="110" x2="228" y2="138" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" style={{ animation: 'hangman-appear 0.4s ease' }} />}
        {wrongGuesses >= 5 && <line x1="200" y1="150" x2="178" y2="190" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" style={{ animation: 'hangman-appear 0.4s ease' }} />}
        {wrongGuesses >= 6 && <line x1="200" y1="150" x2="222" y2="190" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" style={{ animation: 'hangman-appear 0.4s ease' }} />}
      </svg>
      <style>{`
        @keyframes hangman-appear { from { opacity:0; } to { opacity:1; } }
        @keyframes shake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-6px)} 40%,60%{transform:translateX(6px)} }
      `}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function HangmanGame() {
  const { dispatch } = useUser();
  const [gameState, setGameState] = useState<GameState>('select');
  const [category, setCategory] = useState<VocabularyCategory | null>(null);
  const [word, setWord] = useState<VocabularyWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [selectedCatIndex, setSelectedCatIndex] = useState<number | null>(null);

  const startGame = useCallback((cat: VocabularyCategory, index: number) => {
    setSelectedCatIndex(index);
    setCategory(cat);
    const randomWord = cat.words[Math.floor(Math.random() * cat.words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState('playing');
  }, []);

  const guessLetter = useCallback((letter: string) => {
    if (!word || gameState !== 'playing') return;
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.en.toLowerCase().includes(letter)) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 400);
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= MAX_WRONG) {
        setGameState('lost');
        dispatch({ type: 'WRONG_ANSWER' });
        dispatch({ type: 'GAME_PLAYED' });
      }
    } else {
      const allFound = word.en.toLowerCase().split('').every(
        (l) => l === ' ' || l === '-' || newGuessed.has(l)
      );
      if (allFound) {
        setGameState('won');
        dispatch({ type: 'ADD_XP', payload: 10 + (MAX_WRONG - wrongGuesses) * 2 });
        dispatch({ type: 'CORRECT_ANSWER', payload: word.en });
        dispatch({ type: 'GAME_PLAYED' });
      }
    }
  }, [word, gameState, guessedLetters, wrongGuesses, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key) && !guessedLetters.has(key)) guessLetter(key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, guessedLetters, guessLetter]);

  const BackLink = () => (
    <Link
      to="/games"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 mb-4"
    >
      <ChevronLeft size={18} />
      Juegos
    </Link>
  );

  // ── SELECT ───────────────────────────────────────────────────────────
  if (gameState === 'select') {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <BackLink />
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🪢</div>
          <h1 className="text-3xl font-black font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
            Ahorcado
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Adivina la palabra letra por letra antes de que se complete la figura
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vocabularyCategories.map((cat, i) => (
            <button key={cat.id} onClick={() => startGame(cat, i)} className="text-left outline-none group">
              <Card className="border-white/5 hover:border-primary/30 transition-all duration-250 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                    style={{ background: categoryColors[i % categoryColors.length] }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold font-display text-foreground">{cat.nameEs}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cat.words.length} palabras</div>
                  </div>
                  <ChevronLeft
                    size={18}
                    className="text-muted-foreground/40 group-hover:text-primary rotate-180 group-hover:translate-x-1 transition-all shrink-0"
                  />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!word) return null;

  const progressPercent = ((MAX_WRONG - wrongGuesses) / MAX_WRONG) * 100;

  return (
    <div className="max-w-2xl mx-auto py-4 relative">
      {gameState === 'won' && <Confetti />}

      <BackLink />

      {/* Top bar: category + hearts */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-white/8 text-sm font-semibold">
          <span>{category?.icon}</span>
          <span>{category?.nameEs}</span>
        </div>
        <div className="flex gap-1 items-center">
          {Array.from({ length: MAX_WRONG }).map((_, i) => (
            <span
              key={i}
              className={`text-lg transition-all duration-300 ${i >= MAX_WRONG - wrongGuesses ? 'grayscale opacity-30 scale-75' : 'drop-shadow-[0_0_5px_rgba(255,101,132,0.4)]'}`}
            >
              {i < MAX_WRONG - wrongGuesses ? '❤️' : '🤍'}
            </span>
          ))}
        </div>
      </div>

      {/* Health bar */}
      <div className="mb-5">
        <Progress
          value={progressPercent}
          className="h-1.5"
          style={{
            // color the fill depending on remaining health
            ['--progress-color' as string]: progressPercent > 50 ? '#00C896' : progressPercent > 25 ? '#FFD700' : '#FF4757',
          }}
        />
      </div>

      {/* Game area: illustration + hint */}
      <div className="flex items-center justify-center gap-6 flex-wrap mb-6">
        <HangmanIllustration wrongGuesses={wrongGuesses} isLost={gameState === 'lost'} isShaking={shakeWrong} />
        <Card className="border-white/[0.06] bg-[var(--bg-card)] shadow-lg min-w-[160px]">
          <CardContent className="p-5 text-center">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-[var(--color-primary)] mb-2">
              Pista en español
            </div>
            <div className="text-2xl font-extrabold font-display text-foreground">{word.es}</div>
          </CardContent>
        </Card>
      </div>

      {/* Word display */}
      <div className="flex justify-center items-end gap-2 flex-wrap mb-6 py-2">
        {word.en.toLowerCase().split('').map((letter, i) => {
          if (letter === ' ') return <div key={i} className="w-4" />;
          if (letter === '-') return <span key={i} className="text-3xl font-black text-muted-foreground px-1">-</span>;
          const isRevealed = guessedLetters.has(letter) || gameState === 'lost';
          const isLostReveal = gameState === 'lost' && !guessedLetters.has(letter);
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 min-w-[32px]">
              <span className={[
                'text-2xl font-black font-display h-8 flex items-end justify-center transition-all duration-300',
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                isLostReveal ? 'text-red-400' : 'text-foreground',
              ].join(' ')}>
                {isRevealed ? letter.toUpperCase() : ''}
              </span>
              <div className={[
                'w-full h-[3px] rounded-full transition-all duration-300',
                isLostReveal
                  ? 'bg-red-500 shadow-[0_0_6px_rgba(255,71,87,0.5)]'
                  : isRevealed
                    ? 'bg-[var(--color-primary)] shadow-[0_0_6px_var(--color-primary)]'
                    : 'bg-white/10',
              ].join(' ')} />
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      {gameState === 'playing' && (
        <div className="flex flex-col items-center gap-2">
          {keyboardRows.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 justify-center">
              {row.map((letter) => {
                const isGuessed = guessedLetters.has(letter);
                const isCorrect = isGuessed && word.en.toLowerCase().includes(letter);
                const isWrong = isGuessed && !word.en.toLowerCase().includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={isGuessed}
                    className={[
                      'w-9 h-11 rounded-xl text-sm font-extrabold transition-all duration-150 outline-none border',
                      isCorrect
                        ? 'bg-emerald-500 text-white border-transparent shadow-[0_4px_12px_rgba(0,200,150,0.3)]'
                        : isWrong
                          ? 'bg-red-500/10 text-red-400 border-red-500/50 opacity-60 cursor-not-allowed'
                          : 'bg-[var(--bg-card)] border-white/8 text-foreground hover:-translate-y-1 hover:scale-110 hover:border-primary/50 hover:shadow-lg cursor-pointer',
                    ].join(' ')}
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Result overlay */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className={[
            'w-full max-w-sm text-center border-2 shadow-2xl',
            gameState === 'won' ? 'border-emerald-500/50' : 'border-red-500/50',
          ].join(' ')}>
            <CardContent className="p-8 flex flex-col items-center gap-3">
              <div className="text-6xl">{gameState === 'won' ? '🎉' : '💀'}</div>
              <h2 className="text-2xl font-black font-display text-foreground">
                {gameState === 'won' ? '¡Palabra encontrada!' : '¡Oh no!'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {gameState === 'won'
                  ? `Adivinaste "${word.en}" correctamente`
                  : `La palabra era "${word.en}"`}
              </p>
              {gameState === 'won' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-bold">
                  ⭐ +{10 + (MAX_WRONG - wrongGuesses) * 2} XP
                </div>
              )}
              <div className="flex flex-col gap-2.5 w-full mt-3">
                <button
                  onClick={() => category && selectedCatIndex !== null && startGame(category, selectedCatIndex)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  🔄 Jugar de nuevo
                </button>
                <button
                  onClick={() => setGameState('select')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/8 text-secondary-foreground font-semibold hover:bg-white/10 transition-all"
                >
                  📚 Otra categoría
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}