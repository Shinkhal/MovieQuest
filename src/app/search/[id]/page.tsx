"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Clock, Film, Info, Users, Video } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from "@/components/ui/card";

// Define Movie interface for TMDB API data
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  runtime: number | null;
  genres: {
    id: number;
    name: string;
  }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  // Additional fields for credits
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
  // For streaming info (to be fetched separately)
  watch_providers?: {
    results?: {
      IN?: {
        flatrate?: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }[];
        rent?: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }[];
        buy?: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }[];
      };
    };
  };
  // Videos
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
}

export default function MovieDetails() {
  const params = useParams();
  const movieId = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getYear = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const getDirectors = () => {
    if (!movie?.credits?.crew) return [];
    return movie.credits.crew.filter(person => person.job === 'Director');
  };

  const getTrailer = () => {
    if (!movie?.videos?.results || movie.videos.results.length === 0) return null;
    
    const officialTrailers = movie.videos.results.filter(
      video => video.type === 'Trailer' && video.site === 'YouTube' && video.official
    );
    
    if (officialTrailers.length > 0) {
      return officialTrailers[0].key;
    }
    
    const anyTrailers = movie.videos.results.filter(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    if (anyTrailers.length > 0) {
      return anyTrailers[0].key;
    }
    
    const youtubeVideos = movie.videos.results.filter(
      video => video.site === 'YouTube'
    );
    
    return youtubeVideos.length > 0 ? youtubeVideos[0].key : null;
  };

  useEffect(() => {
    const loadMovie = () => {
      try {
        const storedMovie = localStorage.getItem('selectedMovie');
        if (storedMovie) {
          const parsedMovie = JSON.parse(storedMovie);
          
          fetchMovieDetails(parsedMovie.id);
        } else {
          fetchMovieDetails(movieId as string);
        }
      } catch (error) {
        console.error('Error loading movie from localStorage:', error);
        fetchMovieDetails(movieId as string);
      }
    };

    const fetchMovieDetails = async (id: string) => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos&language=en-US`
        );
    
        const providersResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`
        );
    
        const movieData = movieResponse.data;
        const providersData = providersResponse.data;
    
        const combinedData = {
          ...movieData,
          watch_providers: providersData,
        };
    
        setMovie(combinedData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    

    loadMovie();
  }, [movieId]);

  

  const getStreamingProviders = () => {
    if (!movie?.watch_providers?.results?.IN) {
      return (
        <div className="mt-6 text-xl text-red-400 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          No streaming options available in India
        </div>
      );
    }
    
    const providers = movie.watch_providers.results.IN;
    const allProviders = [
      ...(providers.flatrate || []),
      ...(providers.rent || []),
      ...(providers.buy || [])
    ];
    
    if (allProviders.length === 0) {
      return (
        <div className="mt-6 text-xl text-red-400 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          No streaming options available in India
        </div>
      );
    }
  
    // Helper function to open streaming provider
    // Helper function to open streaming provider
const openStreamingService = (providerName: string) => {
  // Format movie title for URLs - remove special characters and use slugified format
  const formatMovieTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .trim();
  };

  const slug = formatMovieTitle(movie.title);
  const year = getYear(movie.release_date);

  type ProviderMap = {
    [key: string]: string;  // Add index signature
  };
  
  const providerUrls: ProviderMap = {
    // Major Global Streaming Services
    'Netflix': `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
    'Amazon Prime Video': `https://www.amazon.com/gp/video/search/ref=atv_sr_sug_3?phrase=${encodeURIComponent(movie.title)}&ie=UTF8`,
    'Amazon Video': `https://www.amazon.com/gp/video/search/ref=atv_sr_sug_3?phrase=${encodeURIComponent(movie.title)}&ie=UTF8`,
    'Prime Video': `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${encodeURIComponent(movie.title)}&ie=UTF8`,
    'Apple TV': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'Apple TV+': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'YouTube': `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' full movie')}`,
    'Google Play Movies': `https://play.google.com/store/search?q=${encodeURIComponent(movie.title)}&c=movies`,
    'Hulu': `https://www.hulu.com/search?q=${encodeURIComponent(movie.title)}`,
    'HBO Max': `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    'Max': `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    
    // India-specific Services - updated with JioHotstar
    'JioHotstar': `https://www.hotstar.com/in/movies/${slug}`, // Fallback for legacy references
    'JioCinema': `https://www.jiocinema.com/movies/${slug}`,
    'SonyLIV': `https://www.sonyliv.com/search?q=${encodeURIComponent(movie.title)}`,
    'Zee5': `https://www.zee5.com/search?q=${encodeURIComponent(movie.title)}`,
    'Voot': `https://www.voot.com/search?q=${encodeURIComponent(movie.title)}`,
    
    // Default fallbacks for other providers
    'default': `https://www.google.com/search?q=watch+${encodeURIComponent(movie.title)}+${encodeURIComponent(year)}+on+${encodeURIComponent(providerName)}`
  };
  
  // Try to use direct URLs for popular streaming services
  // This is a more advanced approach than using search
  const attemptDirectUrl = () => {
    const tmdbId = movie.id;
    const movieSlug = slug;
    
    switch(providerName) {
      case 'Netflix':
        // Netflix uses their own IDs, so we need to search
        return providerUrls['Netflix'];
      
      case 'JioHotstar':
        return `https://www.hotstar.com/in/movies/${movieSlug}`;
        
      case 'JioCinema':
        return `https://www.jiocinema.com/movies/${movieSlug}`;
        
      case 'Prime Video':
      case 'Amazon Video':
      case 'Amazon Prime Video':
        return `https://www.amazon.com/dp/B0${tmdbId.toString().padStart(6, '0')}`;
        
      default:
        // Fall back to provider URL or search
        return providerUrls[providerName] || providerUrls['default'];
    }
  };
  
  // Choose the best URL to open
  const url = attemptDirectUrl();
  
  // Open in a new tab
  window.open(url, '_blank');
};
  
    return (
      <div className="mt-8 px-4">
        <h3 className="text-xl font-bold mb-6 text-white">Where to Watch</h3>
    
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm text-white mb-3 font-medium">Stream</h4>
            <div className="flex flex-wrap gap-4">
              {providers.flatrate.map(provider => (
                <Card 
                  key={provider.provider_id} 
                  className="w-30 h-30 bg-gray-800 border-0 p-1 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => openStreamingService(provider.provider_name)}
                >
                  <CardContent className="flex flex-col items-center p-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden mb-2 bg-muted border border-primary">
                      <img
                        src={getImageUrl(provider.logo_path)}
                        alt={provider.provider_name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className="text-xs text-gray-200 text-center font-medium">
                      {provider.provider_name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
    
        {providers.rent && providers.rent.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm text-yellow-500 mb-3 font-medium">Rent</h4>
            <div className="flex flex-wrap gap-4">
              {providers.rent.map(provider => (
                <Card 
                  key={provider.provider_id} 
                  className="w-25 h-30 bg-gray-800 border-0 p-1 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => openStreamingService(provider.provider_name)}
                >
                  <CardContent className="flex flex-col items-center p-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden mb-2 bg-muted border border-yellow-500">
                      <img
                        src={getImageUrl(provider.logo_path)}
                        alt={provider.provider_name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className="text-xs text-gray-200 text-center font-medium">
                      {provider.provider_name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
    
        {providers.buy && providers.buy.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm text-green-500 mb-3 font-medium">Buy</h4>
            <div className="flex flex-wrap gap-4">
              {providers.buy.map(provider => (
                <Card 
                  key={provider.provider_id} 
                  className="w-25 h-30 bg-gray-800 border-0 p-2 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => openStreamingService(provider.provider_name)}
                >
                  <CardContent className="flex flex-col items-center p-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden mb-2 bg-muted border border-green-500">
                      <img
                        src={getImageUrl(provider.logo_path)}
                        alt={provider.provider_name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className="text-xs text-gray-200 text-center font-medium">
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
  };

  // Render trailer modal
  const renderTrailerModal = () => {
    if (!selectedTrailer) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl mx-auto">
          <Button 
            onClick={() => setSelectedTrailer(null)}
            className="absolute -top-12 right-0 bg-red-600 hover:bg-red-700"
          >
            Close
          </Button>
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl bg-gray-800" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-3/4 bg-gray-800 rounded-lg" />
              <Skeleton className="h-6 w-1/2 bg-gray-800 rounded-lg" />
              <Skeleton className="h-32 w-full bg-gray-800 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3 bg-gray-800 rounded-lg" />
                <Skeleton className="h-6 w-1/4 bg-gray-800 rounded-lg" />
                <Skeleton className="h-6 w-1/2 bg-gray-800 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-200">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">{error || "We couldn't find the movie you're looking for."}</p>
            <Link href="/search">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get trailer key
  const trailerKey = getTrailer();

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 pb-16">
      {/* Movie backdrop as hero background with gradient overlay */}
      <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/80 to-gray-900"></div>
        
        {/* Background image */}
        {movie.backdrop_path ? (
          <div className="absolute inset-0 blur-sm opacity-40">
            <img 
              src={getImageUrl(movie.backdrop_path, 'original')} 
              alt={movie.title}
              className="w-full h-full object-cover "
            />
          </div>
        ) : movie.poster_path ? (
          <div className="absolute inset-0 blur-sm opacity-40">
            <img 
              src={getImageUrl(movie.poster_path, 'original')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
        
        {/* Back button and content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 ">
          <Link href="/search">
            <Button 
              variant="outline"
              className="mb-4 border-gray-700 text-gray-300 bg-gray-900 hover:bg-blue-800 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4 " /> Back to Search
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-xl overflow-hidden shadow-xl">
              {movie.poster_path ? (
                <img 
                  src={getImageUrl(movie.poster_path)} 
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] w-full bg-gray-800 flex items-center justify-center">
                  <Film className="h-16 w-16 text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Trailer button below poster */}
            {trailerKey && (
              <Button 
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={() => setSelectedTrailer(trailerKey)}
              >
                <Video className="h-4 w-4" />
                Watch Trailer
              </Button>
            )}
          </div>
          
          {/* Movie info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-wrap gap-2 items-center mb-2">
              {/* Rating badge */}
              <Badge 
                className={
                  movie.vote_average >= 7 
                    ? "bg-green-500 text-green-950 font-semibold" 
                    : movie.vote_average >= 5 
                      ? "bg-amber-500 text-amber-950 font-semibold"
                      : "bg-red-500 text-red-950 font-semibold"
                }
              >
                <Star className="h-3 w-3 mr-1 fill-current" /> 
                {movie.vote_average.toFixed(1)}
              </Badge>
              
              {/* Year badge */}
              <Badge variant="outline" className="border-gray-700 text-gray-300">
                <Calendar className="h-3 w-3 mr-1" /> 
                {getYear(movie.release_date)}
              </Badge>
              
              {/* Runtime badge */}
              {movie.runtime && (
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  <Clock className="h-3 w-3 mr-1" /> 
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </Badge>
              )}
              
              {/* Status badge */}
              {movie.status && (
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  <Info className="h-3 w-3 mr-1" /> 
                  {movie.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{movie.title}</h1>
            
            {/* Tagline */}
            {movie.tagline && (
              <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
            )}
            
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Overview */}
            {movie.overview && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>
            )}
            
            {/* Directors */}
            {getDirectors().length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">
                  {getDirectors().length > 1 ? 'Directors' : 'Director'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getDirectors().map(director => (
                    <Badge key={director.id} variant="secondary" className="bg-gray-800 text-gray-300">
                      {director.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-400" />
                  Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.credits.cast.slice(0, 10).map(actor => (
                    <div key={actor.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                      {actor.profile_path ? (
                        <img 
                          src={getImageUrl(actor.profile_path)} 
                          alt={actor.name}
                          className="w-full h-48 object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                          <Users className="h-10 w-10 text-gray-600" />
                        </div>
                      )}
                      <div className="p-2">
                        <h4 className="font-medium text-sm text-white truncate">{actor.name}</h4>
                        <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {movie.credits.cast.length > 10 && (
                  <p className="text-gray-400 text-sm mt-2">
                    +{movie.credits.cast.length - 10} more cast members
                  </p>
                )}
              </div>
            )}

            {/* Streaming services */}
            {getStreamingProviders()}
            
            {/* Additional Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financial Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Details</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Release Date</p>
                      <p className="text-white">{formatDate(movie.release_date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-white">{movie.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <p className="text-white">{formatCurrency(movie.budget)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-white">{formatCurrency(movie.revenue)}</p>
                    </div>
                    {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Languages</p>
                        <p className="text-white">
                          {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-200">Production</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4">
                      {movie.production_companies.map(company => (
                        <div key={company.id} className="flex items-center gap-2">
                          {company.logo_path ? (
                            <img 
                              src={getImageUrl(company.logo_path)} 
                              alt={company.name}
                              className="w-8 h-8 object-contain bg-white p-1 rounded"
                            />
                          ) : null}
                          <span className="text-gray-300 text-sm">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      {renderTrailerModal()}
    </div>
  );
}