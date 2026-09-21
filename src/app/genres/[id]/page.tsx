'use client';

import React, { useState } from 'react';
import { useMovies, useGenres } from '@/lib/api';
import { ResultCard } from '@/components/search/ResultCard';
import { Pager } from '@/components/search/Pager';
import { GenreSidebar } from '@/components/genres/GenreSidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Sparkles, Film, ArrowUpDown } from 'lucide-react';

const FALLBACK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export default function GenrePage() {
  const params = useParams();
  const genreId = parseInt(params.id as string, 10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'popularity.desc' | 'vote_average.desc' | 'release_date.desc'>('popularity.desc');

  const { data: fetchedGenres = [] } = useGenres();
  const genres = fetchedGenres.length > 0 ? fetchedGenres : FALLBACK_GENRES;

  // Accurately query movies for this genre!
  const { data, isLoading, error } = useMovies({
    type: 'genre',
    genreId,
    page,
    sortBy,
  });

  const currentGenre = genres.find((g) => g.id === genreId);
  const genreName = currentGenre?.name || 'Genre Movies';

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Header with Breadcrumb */}
      <section className="border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/genres" className="hover:text-foreground transition-colors">
              Genres
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">{genreName}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {genreName} <span className="text-primary">Films</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore popular and top-rated {genreName.toLowerCase()} titles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout: Sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <GenreSidebar genres={genres} />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Sort Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/40 mb-6">
              <span className="text-sm text-muted-foreground font-medium">
                {data?.total_results ? `${data.total_results.toLocaleString()} movies available` : 'Browsing movies'}
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setPage(1);
                  }}
                  className="bg-card text-foreground text-xs sm:text-sm font-medium border border-border/80 rounded-xl px-3 py-1.5 outline-none focus:border-primary transition"
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="vote_average.desc">Top Rated</option>
                  <option value="release_date.desc">Release Date</option>
                </select>
              </div>
            </div>

            {/* Skeletons on loading */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-16">
                <p className="text-destructive font-medium mb-4">
                  Failed to load movies for {genreName}.
                </p>
                <Button onClick={() => setPage(1)}>Try Again</Button>
              </div>
            )}

            {/* Movie grid */}
            {!isLoading && data && data.results.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {data.results.map((movie) => (
                    <ResultCard key={movie.id} movie={movie} />
                  ))}
                </div>

                <div className="pt-8">
                  <Pager
                    currentPage={page}
                    totalPages={Math.min(data.total_pages, 500)}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
