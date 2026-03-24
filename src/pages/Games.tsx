import { Link } from 'react-router-dom';
import { games } from '../data/games';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Lock } from 'lucide-react';

export default function Games() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">🎮 Minijuegos</h1>
        <p className="page-subtitle">Elige un juego y comienza a practicar</p>
      </div>

      <div className="space-y-3">
        {games.map((game, i) => (
          <div key={game.id} className={`animate-fade-in-up stagger-${i + 1}`}>
            {game.available ? (
              <Link to={`/games/${game.id}`}>
                <Card className="hover:bg-accent/50 transition-all cursor-pointer border-white/5 group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                      style={{ background: game.color }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold font-display flex items-center gap-2">
                        {game.nameEs}
                      </div>
                      <div className="text-sm text-muted-foreground">{game.description}</div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="opacity-60 grayscale border-white/5 bg-black/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 opacity-50"
                    style={{ background: game.color }}
                  >
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold font-display text-muted-foreground">{game.nameEs}</div>
                    <div className="text-sm text-muted-foreground/60">{game.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] opacity-70">
                    <Lock size={10} className="mr-1" /> PRÓXIMAMENTE
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
