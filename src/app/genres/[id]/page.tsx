import React, { useState, useEffect } from 'react';
import { useMovies } from '@/lib/api';
import { ResultCard } from '@/components/search/ResultCard';
import { Pager } from '@/components/search/Pager';
import { GenreSidebar } from '@/components/genres/GenreSidebar';
import { cn } from '@/lib/utils';
import { useGenres } from '@/lib/api';

/**
 * Individual genre page – Client Component that fetches movies for the genre
 * and renders them using the shared ResultCard component.
 */
export default function GenrePage() {
  const params = useParams();
  const genreId = parseInt(params.id as string, 10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const { data: genres = [] } = useGenres();

  // Fetch movies for this genre using the API hook (extend later for genre filter)
  const { data, isLoading, error } = useMovies({
    type: 'popular',
    page,
    sortBy: sortBy as any,
  });

  const genreName = genres.find((g) => g.id === genreId)?.name || 'Movies';

  return (
    <main className="bg-background text-foreground min-h-screen pb-12">
      {/* Genre Header */}
      <header className="bg-primary/10 border-b border-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{genreName}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <GenreSidebar genres={genres} />

          {/* Main grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {data?.results?.length || 0} movies found
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('popularity.desc')}
                  className={cn('px-3 py-1 rounded text-sm', sortBy === 'popularity.desc' && 'bg-primary text-primary-foreground')}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSortBy('vote_average.desc')}
                  className={cn('px-3 py-1 rounded text-sm', sortBy === 'vote_average.desc' && 'bg-primary text-primary-foreground')}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSortBy('release_date.desc')}
                  className={cn('px-3 py-1 rounded text-sm', sortBy === 'release_date.desc' && 'bg-primary text-primary-foreground')}
                >
                  Recent
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
            {error && <div className="text-center text-red-500 py-12">Failed to load movies.</div>}
            {data && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {data.results.map((movie) => (
                    <ResultCard key={movie.id} movie={movie} />
                  ))}
                </div>
                <Pager currentPage={page} totalPages={Math.min(data.total_pages, 500)} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
