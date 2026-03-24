import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { games } from '../data/games';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { progress, currentLevelInfo } = useUser();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <section className="animate-fade-in-up">
        <Card className="welcome-banner border-none overflow-hidden relative">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-1">
              {progress.avatar && <span className="text-3xl">{progress.avatar}</span>}
              <h2 className="text-2xl font-bold font-display">¡Hola, {progress.playerName || 'Learner'}! 👋</h2>
            </div>
            <p className="opacity-90">¿Listo para tu práctica diaria de inglés?</p>
            
            <div className="mt-6 flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-2xl">{currentLevelInfo.current.icon}</span>
                <span>Nivel {progress.level}: {currentLevelInfo.current.title}</span>
              </div>
              <div className="text-sm font-bold">{progress.xp} XP</div>
            </div>
            
            <Progress value={currentLevelInfo.progressPercent} className="h-3 bg-white/20" />
            
            {currentLevelInfo.next && (
              <p className="text-xs mt-2 opacity-80 text-right">
                Faltan {currentLevelInfo.next.xpRequired - progress.xp} XP para el nivel {progress.level + 1}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="animate-fade-in-up stagger-1">
        <h3 className="page-subtitle mb-4">Tu progreso</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-2xl font-bold font-display">{progress.streak}</div>
              <div className="text-xs text-muted-foreground">Días de racha</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl mb-1">🧠</div>
              <div className="text-2xl font-bold font-display">{progress.wordsLearned.length}</div>
              <div className="text-xs text-muted-foreground">Palabras aprendidas</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Suggested Games */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="page-subtitle m-0">Recomendados para ti</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/games">Ver todos</Link>
          </Button>
        </div>
        
        <div className="space-y-3">
          {games.filter(g => g.available).slice(0, 2).map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-white/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: game.color }}
                  >
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold font-display">{game.nameEs}</div>
                    <div className="text-xs text-muted-foreground">{game.description}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5">JUGAR</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
