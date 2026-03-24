import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { achievements } from '../data/games';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const AVATARS = [
  '🦁', '🐯', '🦊', '🐼', '🐨', '🦋', '🐸', '🦄',
  '🐉', '🦅', '🦉', '🐺', '🦝', '🐬', '🤖',
  '👾', '🧙', '🧜', '🦸', '🐻',
];

export default function Profile() {
  const { progress, currentLevelInfo, dispatch } = useUser();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(progress.playerName);
  const [editAvatar, setEditAvatar] = useState(progress.avatar);
  const [nameError, setNameError] = useState('');

  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  const handleSave = () => {
    const trimmed = editName.trim();
    if (trimmed.length < 2) { setNameError('Mínimo 2 caracteres'); return; }
    if (!editAvatar) { setNameError('Elige un avatar'); return; }
    dispatch({ type: 'SET_PROFILE', payload: { playerName: trimmed, avatar: editAvatar } });
    setEditing(false);
    setNameError('');
  };

  const handleCancel = () => {
    setEditName(progress.playerName);
    setEditAvatar(progress.avatar);
    setEditing(false);
    setNameError('');
  };

  const stats = [
    { icon: '🎮', value: progress.gamesPlayed, label: 'Partidas' },
    { icon: '✅', value: `${accuracy}%`, label: 'Precisión' },
    { icon: '📝', value: progress.wordsLearned.length, label: 'Palabras' },
    { icon: '🔥', value: progress.streak, label: 'Racha' },
  ];

  return (
    <div className="space-y-5">

      {/* Profile card */}
      <Card className="border-white/[0.06] bg-[var(--bg-card)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
        <CardContent className="p-5">
          {!editing ? (
            /* VIEW MODE */
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-5xl shadow-xl shadow-primary/20 shrink-0">
                {progress.avatar || currentLevelInfo.current.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black font-display text-foreground truncate">
                  {progress.playerName || 'Jugador'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {currentLevelInfo.current.icon} Nivel {progress.level} — {currentLevelInfo.current.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 font-bold text-sm">⭐ {progress.xp} XP</span>
                  {progress.streak > 0 && (
                    <span className="text-orange-400 font-bold text-sm">🔥 {progress.streak} días</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setEditing(true); setEditName(progress.playerName); setEditAvatar(progress.avatar); }}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                ✏️ Editar
              </Button>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="flex flex-col gap-4">
              {/* Avatar preview */}
              <div className="flex flex-col items-center gap-2">
                <div className={[
                  'w-20 h-20 rounded-3xl flex items-center justify-center text-5xl transition-all duration-300',
                  editAvatar
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-xl shadow-primary/20'
                    : 'bg-white/5 border-2 border-dashed border-white/20',
                ].join(' ')}>
                  {editAvatar || '?'}
                </div>
              </div>

              {/* Avatar grid */}
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setEditAvatar(emoji)}
                    className={[
                      'aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all duration-150',
                      editAvatar === emoji
                        ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] scale-110 shadow-lg shadow-primary/30'
                        : 'bg-white/5 border border-white/8 hover:bg-white/10 hover:scale-105',
                    ].join(' ')}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Name input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setNameError(''); }}
                  maxLength={20}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                />
                {nameError && <p className="text-xs text-red-400">{nameError}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <Button variant="ghost" onClick={handleCancel} className="flex-1 border border-white/8">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-[2] bg-gradient-to-r from-[var(--color-primary)] to-[#4834D4] font-bold border-none shadow-lg hover:opacity-90"
                >
                  Guardar ✓
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* XP Progress */}
      <Card className="border-white/[0.06] bg-[var(--bg-card)]">
        <CardContent className="p-5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-muted-foreground">Experiencia</span>
            <span className="text-yellow-400">
              {progress.xp} XP
              {currentLevelInfo.next && ` / ${currentLevelInfo.next.xpRequired} XP`}
            </span>
          </div>
          <Progress value={Math.min(currentLevelInfo.progressPercent, 100)} className="h-2" />
          {currentLevelInfo.next && (
            <p className="text-xs text-muted-foreground text-right">
              Faltan {currentLevelInfo.next.xpRequired - progress.xp} XP para el nivel {progress.level + 1}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">📊 Estadísticas</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon, value, label }) => (
            <Card key={label} className="border-white/[0.06] bg-[var(--bg-card)]">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-black font-display text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">🏆 Logros</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {achievements.map((ach) => {
            const unlocked = progress.achievements.includes(ach.id);
            return (
              <Card
                key={ach.id}
                className={[
                  'border transition-all',
                  unlocked
                    ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 shadow-sm shadow-primary/10'
                    : 'border-white/5 bg-[var(--bg-card)] opacity-40 grayscale',
                ].join(' ')}
              >
                <CardContent className="p-3 text-center flex flex-col gap-1">
                  <div className="text-2xl">{ach.icon}</div>
                  <div className="text-xs font-bold text-foreground leading-tight">{ach.name}</div>
                  <div className="text-[10px] text-muted-foreground leading-snug">{ach.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
