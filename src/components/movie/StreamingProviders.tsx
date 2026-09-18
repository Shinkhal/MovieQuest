import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Movie } from '@/types/api';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

function getImageUrl(path: string | null) {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/w154${path}`;
}

function formatMovieTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function openStreamingService(providerName: string, movie: Movie) {
  const slug = formatMovieTitle(movie.title);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  const providerUrls: Record<string, string> = {
    'Netflix': `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
    'Amazon Prime Video': `https://www.amazon.com/gp/video/search/ref=atv_sr_sug_3?phrase=${encodeURIComponent(movie.title)}&ie=UTF8`,
    'Prime Video': `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${encodeURIComponent(movie.title)}&ie=UTF8`,
    'Apple TV': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'Apple TV+': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'YouTube': `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' full movie')}`,
    'Google Play Movies': `https://play.google.com/store/search?q=${encodeURIComponent(movie.title)}&c=movies`,
    'Hulu': `https://www.hulu.com/search?q=${encodeURIComponent(movie.title)}`,
    'HBO Max': `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    'Max': `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    'JioCinema': `https://www.jiocinema.com/movies/${slug}`,
    'SonyLIV': `https://www.sonyliv.com/search?q=${encodeURIComponent(movie.title)}`,
    'Zee5': `https://www.zee5.com/search?q=${encodeURIComponent(movie.title)}`,
    'Voot': `https://www.voot.com/search?q=${encodeURIComponent(movie.title)}`,
  };

  const url = providerUrls[providerName] || `https://www.google.com/search?q=watch+${encodeURIComponent(movie.title)}+${encodeURIComponent(year)}+on+${encodeURIComponent(providerName)}`;
  window.open(url, '_blank');
}

export function StreamingProviders({ movie }: { movie: Movie }) {
  if (!movie.watch_providers?.results?.IN) {
    return (
      <div className="mt-8 px-4">
        <h3 className="text-xl font-bold mb-6 text-foreground">Where to Watch</h3>
        <div className="text-xl text-red-400 font-medium flex items-center gap-2">
          No streaming options available in India
        </div>
      </div>
    );
  }

  const providers = movie.watch_providers.results.IN;
  const flatrate: Provider[] = providers.flatrate || [];
  const rent: Provider[] = providers.rent || [];
  const buy: Provider[] = providers.buy || [];

  if (flatrate.length === 0 && rent.length === 0 && buy.length === 0) {
    return (
      <div className="mt-8 px-4">
        <h3 className="text-xl font-bold mb-6 text-foreground">Where to Watch</h3>
        <div className="text-xl text-red-400 font-medium flex items-center gap-2">
          No streaming options available in India
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4">
      <h3 className="text-xl font-bold mb-6 text-foreground">Where to Watch</h3>

      {flatrate.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm text-foreground mb-3 font-medium">Stream</h4>
          <div className="flex flex-wrap gap-4">
            {flatrate.map((provider) => (
              <Card
                key={provider.provider_id}
                className="w-28 h-28 bg-muted/50 border-0 p-1 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => openStreamingService(provider.provider_name, movie)}
              >
                <CardContent className="flex flex-col items-center p-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mb-2 bg-background border border-muted">
                    <Image
                      src={getImageUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground text-center font-medium">
                    {provider.provider_name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {rent.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm text-amber-500 mb-3 font-medium">Rent</h4>
          <div className="flex flex-wrap gap-4">
            {rent.map((provider) => (
              <Card
                key={provider.provider_id}
                className="w-24 h-28 bg-muted/50 border-0 p-1 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => openStreamingService(provider.provider_name, movie)}
              >
                <CardContent className="flex flex-col items-center p-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mb-2 bg-background border border-amber-500">
                    <Image
                      src={getImageUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground text-center font-medium">
                    {provider.provider_name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {buy.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm text-green-500 mb-3 font-medium">Buy</h4>
          <div className="flex flex-wrap gap-4">
            {buy.map((provider) => (
              <Card
                key={provider.provider_id}
                className="w-24 h-28 bg-muted/50 border-0 p-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => openStreamingService(provider.provider_name, movie)}
              >
                <CardContent className="flex flex-col items-center p-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mb-2 bg-background border border-green-500">
                    <Image
                      src={getImageUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground text-center font-medium">
                    {provider.provider_name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}