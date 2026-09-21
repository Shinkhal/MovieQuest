import { getGenresServer } from '@/lib/api';
import { GenreCard } from '@/components/genres/GenreCard';
import { Sparkles, Film } from 'lucide-react';

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

export const metadata = {
  title: 'Browse Movie Genres | MovieQuest',
  description: 'Explore movies across all genres - Action, Sci-Fi, Drama, Comedy, Horror, Romance, and more.',
};

export default async function GenresPage() {
  const fetchedGenres = await getGenresServer();
  const genres = fetchedGenres.length > 0 ? fetchedGenres : FALLBACK_GENRES;

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Header */}
      <section className="relative py-16 px-4 border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Categories
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore by <span className="text-primary">Genre</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            From adrenaline-packed action blockbusters to heartwarming indie dramas, find movies tailored to your exact mood.
          </p>
        </div>
      </section>

      {/* Genre Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </div>
    </main>
  );
}