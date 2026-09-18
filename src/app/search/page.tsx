import React, { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies'; // we'll create this hook next
import { SearchBar } from '@/components/search/SearchBar';
import { ResultCard } from '@/components/search/ResultCard';
import { Pager } from '@/components/search/Pager';
import { cn } from '@/lib/utils';

/**
 * Main search page – consumes the `useMovies` hook, renders the search bar,
 * filters, results grid and pagination.
 */
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'popular' | 'trending' | 'search'>('popular');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'popularity' | 'rating' | 'date'>('popularity');

  const { data, isLoading, error } = useMovies({
    type: searchMode,
    query: searchTerm,
    page,
    sortBy:
      sort === 'popularity'
        ? 'popularity.desc'
        : sort === 'rating'
        ? 'vote_average.desc'
        : 'release_date.desc',
  });

  // Reset paging when search type or query changes
  useEffect(() => {
    setPage(1);
  }, [searchMode, searchTerm, sort]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchMode(term ? 'search' : 'popular');
  };

  return (
    <main className="bg-background text-foreground min-h-screen pb-12">
      <SearchBar onSearch={handleSearch} />

      {/* Filters – only show for non‑search mode */}
      {searchMode !== 'search' && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setSort('popularity')}
            className={cn('px-4 py-2 rounded', sort === 'popularity' && 'bg-primary text-primary-foreground')}
          >
            Popular
          </button>
          <button
            onClick={() => setSort('rating')}
            className={cn('px-4 py-2 rounded', sort === 'rating' && 'bg-primary text-primary-foreground')}
          >
            Top Rated
          </button>
          <button
            onClick={() => setSort('date')}
            className={cn('px-4 py-2 rounded', sort === 'date' && 'bg-primary text-primary-foreground')}
          >
            Recent
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-12">Failed to load movies.</div>
      )}

      {data && (
        <>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-8">
            {data.results.map((movie) => (
              <ResultCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Pager currentPage={page} totalPages={Math.min(data.total_pages, 500)} onPageChange={setPage} />
        </>
      )}
    </main>
  );
}
