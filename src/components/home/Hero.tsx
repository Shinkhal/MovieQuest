'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search as LucideSearch, Film, Sparkles, TrendingUp, Play, Star, Clapperboard } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const trendingTags = [
    { label: 'Sci-Fi', href: '/genres/878' },
    { label: 'Action', href: '/genres/28' },
    { label: 'Animation', href: '/genres/16' },
    { label: 'Drama', href: '/genres/18' },
    { label: 'Top Rated', href: '/search' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/40">
      {/* Dynamic atmospheric background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 via-amber-500/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none opacity-60 dark:opacity-40" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Spotlight Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-xs sm:text-sm font-semibold shadow-sm animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>Discover 15,000+ Movies & Streaming Guides</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
            Cinematic Discovery, <br />
            <span className="bg-gradient-to-r from-primary via-amber-500 to-rose-500 bg-clip-text text-transparent">
              Tailored For You.
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Find what to watch across theaters and top streaming services. Explore trending blockbusters, hidden indie gems, and personalized recommendations.
          </p>
        </div>

        {/* Direct Search Bar in Hero */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-border/80 bg-card/90 backdrop-blur-xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all">
            <div className="pl-4 text-muted-foreground pointer-events-none">
              <LucideSearch className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by title, director, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 sm:h-16 pl-3 pr-28 sm:pr-32 bg-transparent border-0 text-sm sm:text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
            />
            <Button
              type="submit"
              className="absolute right-2 sm:right-2.5 h-10 sm:h-11 px-4 sm:px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-transform active:scale-95"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Popular:
          </span>
          {trendingTags.map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="px-3 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* Quick CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/search">
            <Button size="lg" className="rounded-xl px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 gap-2">
              <Film className="h-4 w-4" />
              Explore All Movies
            </Button>
          </Link>
          <Link href="/genres">
            <Button size="lg" variant="outline" className="rounded-xl px-6 border-border/80 hover:bg-muted font-medium gap-2">
              <Clapperboard className="h-4 w-4 text-primary" />
              Browse Genres
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
