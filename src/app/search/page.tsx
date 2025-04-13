"use client";
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star, Search, X, Film, TrendingUp, PlayCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from 'next/link';

// Movie interface to handle TMDB API response
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  // Additional fields for streaming info
  streamingInfo?: {
    in?: Record<string, {
      link: string;
      quality: string;
      added: number;
    }[]>;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// Genre mapping
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export default function Searches() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emptySearchError, setEmptySearchError] = useState('');
  const [searchType, setSearchType] = useState<'popular' | 'trending' | 'search'>('popular');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date'>('popularity');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Map streaming service names to prettier display names
  const streamingServiceMap: Record<string, string> = {
    netflix: 'Netflix',
    prime: 'Prime Video',
    hotstar: 'Disney+ Hotstar',
    zee5: 'ZEE5',
    sony: 'SonyLIV',
    mubi: 'MUBI',
    apple: 'Apple TV+',
    jiocinema: 'JioCinema',
    voot: 'Voot'
  };

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setEmptySearchError('');
  };

  // Format release date to year
  const extractYear = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  };

  // Get poster URL with fallback
  const getPosterUrl = (posterPath: string | null): string => {
    if (!posterPath) return '';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Fetch movies based on current state
  useEffect(() => {
    // Skip initial render if in search mode with empty query
    if (searchType === 'search' && search === '') return;
    
    const fetchMovies = async () => {
      setLoading(true);
      setError('');
      
      try {
        // TMDB API key
        const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY ;
        let response;
        
        if (searchType === 'popular') {
          // Fetch popular movies
          const sortParam = sortBy === 'popularity' ? 'popularity.desc' : 
                           sortBy === 'rating' ? 'vote_average.desc' : 
                           'release_date.desc';
                           
          response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&sort_by=${sortParam}&include_adult=false&include_video=false&page=${currentPage}&with_watch_monetization_types=flatrate`
          );
          
          if (response.data && response.data.results) {
            setMovies(response.data.results);
            setTotalPages(Math.min(response.data.total_pages, 500)); // TMDB limits to 500 pages
          } else {
            setMovies([]);
            setError('No results found or unexpected API response format');
          }
        } else if (searchType === 'trending') {
          // Fetch trending movies
          response = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}&page=${currentPage}`
          );
          
          if (response.data && response.data.results) {
            setMovies(response.data.results);
            setTotalPages(Math.min(response.data.total_pages, 500));
          } else {
            setMovies([]);
            setError('No results found or unexpected API response format');
          }
        } else {
          // Search movies
          response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(search)}&include_adult=false&language=en-US&page=${currentPage}`
          );
          
          if (response.data && response.data.results) {
            setMovies(response.data.results);
            setTotalPages(Math.min(response.data.total_pages, 500));
          } else {
            setMovies([]);
            setError('No results found or unexpected API response format');
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies. Please try again later.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    // Delay API call for search to avoid excessive calls
    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, searchType, sortBy, currentPage]);

  // Handle search button click
  const handleSearch = () => {
    if (search.trim() === '') {
      setEmptySearchError('Please enter a search term.');
      return;
    }
    
    setSearchType('search');
    setCurrentPage(1); // Reset to first page when searching
    setEmptySearchError('');
  };

  // Handle Enter key press for search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Reset to popular movies view
  const resetToPopular = () => {
    setSearch('');
    setSearchType('popular');
    setCurrentPage(1); // Reset to first page
  };

  // Handle switching to trending view
  const switchToTrending = () => {
    setSearch('');
    setSearchType('trending');
    setCurrentPage(1); // Reset to first page
  };

  // Handle viewing movie details
  const handleViewDetails = (movie: Movie) => {
    // Store movie details in localStorage to access from detail page
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    // Navigate to details page with the movie ID
    router.push(`/search/${movie.id}`);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Maximum number of page links to show
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of visible pages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust if we're near the start
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Hero Search Section with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/5 to-transparent">
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            {/* Animated Title with glow effect */}
            <div className="text-center h-[300px]">
              <motion.div 
                className="flex items-center justify-center space-x-2 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Film className="h-6 w-6 text-indigo-400" />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">MOVIE-QUEST</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold">
                Discover Your Next <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Favorite</span> Film
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-gray-300 mt-4 max-w-2xl mx-auto text-lg"
              >
                Search across thousands of titles and find where to stream Indian movies
              </motion.p>
            </div>

            {/* Search Bar with glass effect */}
            <motion.div 
              className="w-full max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    type="search"
                    placeholder="Search for movies..."
                    value={search}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="bg-gray-800/80 backdrop-blur border-gray-700 pl-10 py-6 rounded-xl text-white w-full shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-indigo-500/20"
                >
                  Search
                </Button>
              </div>
              
              {emptySearchError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 mt-2 text-sm"
                >
                  {emptySearchError}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Results Section with cooler background */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {searchType === 'popular' ? (
                  <>
                    <Star className="h-6 w-6 mr-2 text-indigo-400" />
                    Popular Movies
                  </>
                ) : searchType === 'trending' ? (
                  <>
                    <TrendingUp className="h-6 w-6 mr-2 text-indigo-400" />
                    Trending This Week
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6 mr-2 text-indigo-400" />
                    Search Results for "{search}"
                  </>
                )}
              </h2>
              <p className="text-gray-400">
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {searchType === 'search' && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetToPopular}
                    className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Popular Movies
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={switchToTrending}
                    className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Trending Movies
                  </Button>
                </div>
              )}
              
              {searchType !== 'search' && (
                <Tabs 
                  defaultValue="popularity" 
                  className="w-full sm:w-auto"
                  onValueChange={(value) => {
                    setSortBy(value as 'popularity' | 'rating' | 'date');
                    setCurrentPage(1); // Reset to first page when changing sort
                  }}
                  value={sortBy}
                >
                  <TabsList className="bg-cyan-700 border border-gray-700 text-white">
                    <TabsTrigger value="popularity">Popular</TabsTrigger>
                    <TabsTrigger value="rating">Top Rated</TabsTrigger>
                    <TabsTrigger value="date">Recent</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              {searchType === 'popular' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={switchToTrending}
                  className="text-xs bg-red-500 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Trending
                </Button>
              )}
              
              {searchType === 'trending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToPopular}
                  className="text-xs bg-red-500 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  View Popular
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700 shadow-md">
                  <div className="relative aspect-[2/3] w-full">
                    <Skeleton className="absolute inset-0 bg-gray-700" />
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-1/2 bg-gray-700" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-red-400 text-lg font-semibold mb-2">Error</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-200">No Movies Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchType === 'search' 
                    ? `We couldn't find any movies matching "${search}". Try different keywords or check your spelling.` 
                    : "No movies available at the moment. Please try again later."}
                </p>
                {searchType === 'search' && (
                  <Button 
                    variant="outline" 
                    onClick={resetToPopular}
                    className="border-gray-700 hover:bg-gray-700 text-gray-200"
                  >
                    Back to Popular Movies
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {movies.map((movie) => (
                  <motion.div key={movie.id} variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:border-indigo-600/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col group ">
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        {movie.poster_path ? (
                            
                          <img 
                            src={getPosterUrl(movie.poster_path)} 
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onClick={() => handleViewDetails(movie)}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                            <Film className="h-12 w-12 text-gray-500" />
                          </div>
                        )}

                        {/* Rating badge */}
                        <div className="absolute top-2 right-2">
                          <Badge 
                            className={cn(
                              "font-medium shadow-md",
                              movie.vote_average > 0 
                                ? movie.vote_average >= 7 
                                  ? "bg-gradient-to-r from-green-500 to-green-600" 
                                  : movie.vote_average >= 5 
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600"
                                    : "bg-gradient-to-r from-red-500 to-red-600"
                                : "bg-gradient-to-r from-gray-500 to-gray-600"
                            )}
                          >
                            <Star className="h-3 w-3 mr-1 fill-current" /> 
                            {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "N/A"}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 flex-grow">
                        <h3 className="font-semibold line-clamp-1 text-base text-gray-100 group-hover:text-indigo-300 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {extractYear(movie.release_date)}
                        </p>
                        
                        {/* Add genres if available */}
                        {movie.genre_ids && movie.genre_ids.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {movie.genre_ids.slice(0, 2).map(genreId => (
                              <span key={genreId} className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                {genreMap[genreId] || 'Unknown'}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Movie popularity badge */}
                        {movie.popularity > 0 && (
                          <div className="mt-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs border-indigo-500/30 text-indigo-300 bg-indigo-500/10"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popularity: {Math.round(movie.popularity)}
                            </Badge>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button 
                          onClick={() => handleViewDetails(movie)}
                          className="w-full bg-indigo-600/60 hover:bg-indigo-600 text-white text-sm flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 pb-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  {/* Pagination page jump - optional enhancement */}
                  <div className="flex justify-center mt-4">
                    <span className="text-gray-400 text-sm">
                      Showing page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}