import { useGenres } from '@/lib/api';
import { GenreCard } from '@/components/genres/GenreCard';

/**
 * Genres index page – Server Component that fetches genre list at request time.
 */
export default async function GenresPage() {
  const { data: genres = [], isLoading } = useGenres();

  return (
    <main className="bg-background text-foreground min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Movies by Genre</h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {genres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}