// app/genres/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

// API constants
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY ;
const BASE_URL = 'https://api.themoviedb.org/3';

// Type for genre
interface Genre {
  id: number;
  name: string;
}

// Genre backgrounds for visual appeal
const genreBackgrounds: Record<number, string> = {
  28: 'from-red-500 to-red-700', // Action
  12: 'from-amber-500 to-amber-700', // Adventure
  16: 'from-blue-400 to-blue-600', // Animation
  35: 'from-yellow-400 to-yellow-600', // Comedy
  80: 'from-slate-600 to-slate-800', // Crime
  99: 'from-emerald-500 to-emerald-700', // Documentary
  18: 'from-purple-500 to-purple-700', // Drama
  10751: 'from-green-400 to-green-600', // Family
  14: 'from-indigo-500 to-indigo-700', // Fantasy
  36: 'from-stone-500 to-stone-700', // History
  27: 'from-black to-gray-800', // Horror
  10402: 'from-pink-400 to-pink-600', // Music
  9648: 'from-violet-600 to-violet-800', // Mystery
  10749: 'from-rose-400 to-rose-600', // Romance
  878: 'from-cyan-500 to-cyan-700', // Science Fiction
  10770: 'from-gray-400 to-gray-600', // TV Movie
  53: 'from-orange-500 to-orange-700', // Thriller
  10752: 'from-stone-600 to-stone-800', // War
  37: 'from-amber-600 to-amber-800', // Western
};

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <div className=" py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Movies by Genre
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover new favorites by exploring our collection of movies sorted by genre
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {genres.map((genre) => (
              <Link href={`/genres/${genre.id}`} key={genre.id}>
                <Card className="overflow-hidden hover:shadow-xl transition duration-300 h-full 
  backdrop-blur-md bg-white/5 border border-white/10 shadow-md rounded-xl text-white">

                  <div className={`h-30 bg-gradient-to-r ${genreBackgrounds[genre.id] || 'from-gray-500 to-gray-700'}`}>
                    <div className="h-full flex items-center justify-center">
                      <h2 className="text-2xl font-bold text-white">{genre.name}</h2>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-300">
                      Explore {genre.name} movies and discover new favorites in this category.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}