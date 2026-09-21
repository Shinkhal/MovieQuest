'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ResultCard } from '@/components/search/ResultCard';
import { Button } from '@/components/ui/button';
import { Bookmark, Film, Trash2, ArrowUpDown, Sparkles } from 'lucide-react';

export default function WatchlistPage() {
  const { watchlist, isLoaded, removeFromWatchlist } = useWatchlist();
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default insertion order
  });

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="relative py-12 px-4 border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              Saved Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              My <span className="text-primary">Watchlist</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoaded
                ? `${watchlist.length} ${watchlist.length === 1 ? 'movie' : 'movies'} saved to watch`
                : 'Loading watchlist...'}
            </p>
          </div>

          {watchlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link href="/profile">
                <Button size="sm" variant="outline" className="rounded-xl border-border/80 text-xs font-semibold gap-1.5 h-9">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Cinephile Passport</span>
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-card text-foreground text-xs sm:text-sm font-medium border border-border/80 rounded-xl px-3 py-2 outline-none focus:border-primary transition h-9"
                >
                  <option value="date">Recently Added</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoaded ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mx-auto text-muted-foreground">
              <Bookmark className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Your watchlist is empty</h2>
              <p className="text-sm text-muted-foreground">
                Bookmark movies from search results or movie pages to save them for your next movie night.
              </p>
            </div>
            <Link href="/search">
              <Button size="lg" className="rounded-xl bg-primary text-primary-foreground font-semibold gap-2 shadow-lg shadow-primary/20">
                <Film className="h-4 w-4" />
                Explore Movies Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {sortedWatchlist.map((movie) => (
              <ResultCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
