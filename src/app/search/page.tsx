'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMovies, useGenres, MovieFetchType } from '@/lib/api';
import { SearchBar } from '@/components/search/SearchBar';
import { ResultCard } from '@/components/search/ResultCard';
import { Pager } from '@/components/search/Pager';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, TrendingUp, Star, Clapperboard, Filter, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') ? parseInt(searchParams.get('genre')!, 10) : undefined;

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<MovieFetchType>(
    initialQuery ? 'search' : initialGenre ? 'genre' : 'popular'
  );
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(initialGenre);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'popularity.desc' | 'vote_average.desc' | 'release_date.desc'>('popularity.desc');

  const { data: genres = [] } = useGenres();

  const { data, isLoading, isFetching, error } = useMovies({
    type: activeCategory,
    query: searchTerm,
    genreId: selectedGenre,
    page,
    sortBy: sort,
  });

  // Keep search state synchronized with URL query params
  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      setActiveCategory('search');
    }
  }, [initialQuery]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    if (term.trim()) {
      setActiveCategory('search');
      setSelectedGenre(undefined);
    } else {
      setActiveCategory('popular');
    }
  };

  const handleCategoryChange = (cat: MovieFetchType) => {
    setActiveCategory(cat);
    setSearchTerm('');
    setSelectedGenre(undefined);
    setPage(1);
  };

  const handleGenreSelect = (genreId: number | undefined) => {
    setSelectedGenre(genreId);
    setSearchTerm('');
    setActiveCategory(genreId ? 'genre' : 'popular');
    setPage(1);
  };

  const categories: { id: MovieFetchType; label: string; icon: React.ReactNode }[] = [
    { id: 'popular', label: 'Popular', icon: <Flame className="h-4 w-4" /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'top_rated', label: 'Top Rated', icon: <Star className="h-4 w-4" /> },
    { id: 'now_playing', label: 'In Theatres', icon: <Clapperboard className="h-4 w-4" /> },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header / Search Bar */}
      <section className="relative py-12 px-4 border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore <span className="text-primary">Movies</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Search thousands of films, filter by category or genre, and find what to watch next.
          </p>

          <div className="pt-2">
            <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Category and Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Categories / Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id && !searchTerm && !selectedGenre;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    'rounded-full gap-2 transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat.icon}
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Genre selector & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Genre filter select */}
            <select
              value={selectedGenre || ''}
              onChange={(e) => handleGenreSelect(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-card text-foreground text-xs sm:text-sm font-medium border border-border/80 rounded-xl px-3 py-2 outline-none focus:border-primary transition"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Sort order select */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-card text-foreground text-xs sm:text-sm font-medium border border-border/80 rounded-xl px-3 py-2 outline-none focus:border-primary transition"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Release Date</option>
            </select>
          </div>
        </div>

        {/* Results title & status */}
        <div className="py-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {searchTerm
              ? `Search results for "${searchTerm}"`
              : selectedGenre
              ? `Browsing ${genres.find((g) => g.id === selectedGenre)?.name || 'Genre'} movies`
              : `Showing ${activeCategory.replace('_', ' ')} movies`}
          </span>
          {data?.total_results ? (
            <span className="text-xs">
              Page {page} of {Math.min(data.total_pages, 500)} ({data.total_results.toLocaleString()} titles)
            </span>
          ) : null}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 py-6">
            {Array.from({ length: 15 }).map((_, i) => (
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
          <div className="text-center py-16 space-y-4">
            <p className="text-destructive font-medium">Failed to load movies from TMDB.</p>
            <Button variant="outline" onClick={() => handleCategoryChange('popular')}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && data && data.results.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto" />
            <h3 className="text-lg font-semibold">No movies found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any movies matching your current filters. Try searching with different keywords.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre(undefined);
                setActiveCategory('popular');
              }}
            >
              Reset to Popular
            </Button>
          </div>
        )}

        {/* Movie Results Grid */}
        {!isLoading && data && data.results.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 py-4">
              {data.results.map((movie) => (
                <ResultCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="pt-8">
              <Pager
                currentPage={page}
                totalPages={Math.min(data.total_pages, 500)}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
