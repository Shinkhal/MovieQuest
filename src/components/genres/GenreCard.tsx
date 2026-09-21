import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Swords,
  Compass,
  Smile,
  Skull,
  Rocket,
  Sparkles,
  Heart,
  Music,
  Flame,
  Shield,
  Film,
  Camera,
  History,
  Tv,
  HelpCircle,
  Eye,
  Crosshair,
  BookOpen,
} from 'lucide-react';

const GENRE_THEMES: Record<
  string,
  { gradient: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Action: { gradient: 'from-orange-600 to-red-700', icon: Swords },
  Adventure: { gradient: 'from-amber-600 to-yellow-600', icon: Compass },
  Animation: { gradient: 'from-pink-500 to-rose-600', icon: Sparkles },
  Comedy: { gradient: 'from-yellow-500 to-amber-600', icon: Smile },
  Crime: { gradient: 'from-slate-700 to-zinc-900', icon: Crosshair },
  Documentary: { gradient: 'from-emerald-600 to-teal-700', icon: Camera },
  Drama: { gradient: 'from-indigo-600 to-violet-800', icon: BookOpen },
  Family: { gradient: 'from-cyan-500 to-blue-600', icon: Sparkles },
  Fantasy: { gradient: 'from-purple-600 to-pink-600', icon: Sparkles },
  History: { gradient: 'from-stone-600 to-amber-800', icon: History },
  Horror: { gradient: 'from-rose-900 to-black', icon: Skull },
  Music: { gradient: 'from-fuchsia-600 to-purple-700', icon: Music },
  Mystery: { gradient: 'from-blue-900 to-indigo-950', icon: Eye },
  Romance: { gradient: 'from-rose-500 to-red-600', icon: Heart },
  'Science Fiction': { gradient: 'from-cyan-600 to-blue-800', icon: Rocket },
  'TV Movie': { gradient: 'from-teal-600 to-slate-800', icon: Tv },
  Thriller: { gradient: 'from-red-800 to-zinc-900', icon: Flame },
  War: { gradient: 'from-stone-700 to-zinc-900', icon: Shield },
  Western: { gradient: 'from-amber-700 to-yellow-900', icon: Compass },
};

export function GenreCard({ genre }: { genre: { id: number; name: string } }) {
  const theme = GENRE_THEMES[genre.name] || {
    gradient: 'from-primary/80 to-purple-800',
    icon: Film,
  };
  const Icon = theme.icon;

  return (
    <Link href={`/genres/${genre.id}`} className="block group">
      <Card
        className={cn(
          'relative overflow-hidden rounded-2xl border-0 shadow-md transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl',
          'bg-gradient-to-br',
          theme.gradient
        )}
      >
        <div className="relative z-10 p-6 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white shadow-inner group-hover:scale-110 transition-transform">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-sm">
              Explore
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-sm group-hover:translate-x-1 transition-transform">
              {genre.name}
            </h2>
          </div>
        </div>

        {/* Ambient subtle glow overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </Card>
    </Link>
  );
}
