import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AVATARS = [
  '🦁', '🐯', '🦊', '🐼', '🐨', '🦋', '🐸', '🦄',
  '🐉', '🦅', '🦉', '🐺', '🦝', '🦋', '🐬', '🤖',
  '👾', '🧙', '🧜', '🦸',
];

interface PlayerSetupProps {
  onDone: () => void;
}

export default function PlayerSetup({ onDone }: PlayerSetupProps) {
  const { dispatch } = useUser();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [step, setStep] = useState<'name' | 'avatar'>('name');
  const [error, setError] = useState('');

  const handleNameNext = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Tu nombre debe tener al menos 2 caracteres');
      return;
    }
    setError('');
    setStep('avatar');
  };

  const handleFinish = () => {
    if (!selectedAvatar) return;
    dispatch({
      type: 'SET_PROFILE',
      payload: { playerName: name.trim(), avatar: selectedAvatar },
    });
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-[var(--bg-primary)] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 py-6">

        {/* Logo */}
        <div className="text-center">
          <div className="text-5xl mb-2">🇬🇧</div>
          <h1 className="text-3xl font-black font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            EnglishPlay
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 'name' ? '¡Bienvenido! Cuéntanos tu nombre' : 'Ahora elige tu avatar'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 justify-center">
          <div className={`h-1.5 w-8 rounded-full transition-all ${step === 'name' ? 'bg-[var(--color-primary)]' : 'bg-emerald-500'}`} />
          <div className={`h-1.5 w-8 rounded-full transition-all ${step === 'avatar' ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`} />
        </div>

        <Card className="border-white/[0.08] bg-[var(--bg-card)] shadow-2xl">
          <CardContent className="p-6 flex flex-col gap-5">

            {step === 'name' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                    placeholder="Ej: Matias, Sol, Pepe..."
                    maxLength={20}
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                  />
                  {error && (
                    <p className="text-xs text-red-400">{error}</p>
                  )}
                </div>
                <Button
                  onClick={handleNameNext}
                  className="w-full py-5 text-base font-bold bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] hover:opacity-90 border-none shadow-lg shadow-primary/20"
                >
                  Continuar →
                </Button>
              </>
            )}

            {step === 'avatar' && (
              <>
                {/* Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className={[
                    'w-20 h-20 rounded-3xl flex items-center justify-center text-5xl transition-all duration-300',
                    selectedAvatar
                      ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-xl shadow-primary/30 scale-100'
                      : 'bg-white/5 border-2 border-dashed border-white/20 scale-95',
                  ].join(' ')}>
                    {selectedAvatar || '?'}
                  </div>
                  <p className="text-sm font-bold text-foreground">{name}</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedAvatar(emoji)}
                      className={[
                        'w-full aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all duration-150',
                        selectedAvatar === emoji
                          ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] scale-110 shadow-lg shadow-primary/30'
                          : 'bg-white/5 border border-white/8 hover:bg-white/10 hover:scale-105',
                      ].join(' ')}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('name')}
                    className="flex-1 border border-white/8"
                  >
                    ← Atrás
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={!selectedAvatar}
                    className="flex-2 flex-[2] py-5 font-bold bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] hover:opacity-90 border-none shadow-lg shadow-primary/20 disabled:opacity-40"
                  >
                    ¡Empezar! 🚀
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
