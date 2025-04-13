// app/genres/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Star, BookmarkPlus, Info } from 'lucide-react';


// Define types
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

interface Genre {
  id: number;
  name: string;
}

// API constants
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

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
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export default function GenrePage() {
  const params = useParams();
  const genreId = typeof params.id === 'string' ? parseInt(params.id) : 28; 

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [minRating, setMinRating] = useState(0);
  const [yearFilter, setYearFilter] = useState('all'); // Changed from empty string to 'all'
  const [popularGenres, setPopularGenres] = useState<Genre[]>([]);

  const router = useRouter();

  // Fetch movies by genre
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const yearParam = yearFilter !== 'all' ? `&primary_release_year=${yearFilter}` : '';
        const ratingParam = minRating > 0 ? `&vote_average.gte=${minRating}` : '';
        
        const response = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=${sortBy}${yearParam}${ratingParam}`
        );
        const data = await response.json();
        
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB API limit is 500 pages
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (genreId) {
      fetchMovies();
    }
  }, [genreId, page, sortBy, minRating, yearFilter]);

  // Fetch popular genres for sidebar
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();
        setPopularGenres(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Generate array of years for filtering (from 1970 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1969 }, (_, i) => (currentYear - i).toString());

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleViewDetails = (movie: Movie) => {
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    router.push(`/search/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-700 to-black
 ">
      {/* Header section with genre background */}
      <div className="relative h-40 md:h-50 bg-gradient-to-b from-indigo-300 to-gray-800 mb-8">
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {genreMap[genreId] || 'Loading...'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/5">
            <div className="bg-gradient-to-b from-gray-600 to-gray-800 text-neutral-100 rounded-lg shadow p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity.desc">Popularity</SelectItem>
                      <SelectItem value="vote_average.desc">Rating</SelectItem>
                      <SelectItem value="release_date.desc">Newest First</SelectItem>
                      <SelectItem value="release_date.asc">Oldest First</SelectItem>
                      <SelectItem value="revenue.desc">Highest Grossing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Release Year</label>
                  <Select
                    value={yearFilter}
                    onValueChange={(value) => setYearFilter(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating: {minRating}
                  </label>
                  <Slider
                    value={[minRating]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => setMinRating(value[0])}
                    className="my-4"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-gray-600 to-gray-800 text-neutral-100 rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Browse Genres</h2>
              <div className="space-y-2">
                {popularGenres.map((genre) => (
                  <Link 
                    href={`/genres/${genre.id}`} 
                    key={genre.id}
                    className={`block px-3 py-2 rounded-md hover:bg-blue-700 transition ${
                      genre.id === genreId ? 'bg-blue-600 font-medium' : ''
                    }`}
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : movies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {movies.map((movie) => (
                    <Card key={movie.id} className="overflow-hidden hover:shadow-2xl transition duration-300 backdrop-blur-lg bg-white/20 border border-white/30 shadow-xl
 text-white pl-2 pr-2">
                      <div className="relative aspect-[3/4] ">
                        {movie.poster_path ? (
                          <Image
                            src={`${IMG_URL}${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            No image available
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1" title={movie.title}>
                            {movie.title}
                          </h3>
                          <Badge className="flex items-center gap-1 text-yellow-300 bg-gray-950">
                            <Star className="h-3 w-3" />
                            {movie.vote_average.toFixed(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                        <p className="text-sm line-clamp-2 mb-4" title={movie.overview}>
                          {movie.overview || 'No description available.'}
                        </p>
                        <div className="flex gap-2">
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 bg-gray-800 hover:bg-gray-950 text-white"
                            onClick={() => handleViewDetails(movie)}
                          >
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination className="mt-8 text-white">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) handlePageChange(page - 1);
                        }}
                        className={page <= 1 ? "pointer-events-none opacity-50 " : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show current page and neighbors
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum} >
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={page === pageNum}
                            
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) handlePageChange(page + 1);
                        }}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <div className="text-center p-12">
                <h3 className="text-xl font-medium mb-2">No movies found</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}