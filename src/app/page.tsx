'use client';

import React from 'react';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import { MovieCarousel } from '@/components/home/MovieCarousel';
import { StatCard } from '@/components/home/StatCard';
import { BenefitCard } from '@/components/home/BenefitCard';
import TestimonialSection from '@/components/Testimonials';
import { useMovies } from '@/lib/api';
import {
  Film,
  Sparkles,
  Heart,
  Clock,
  Star,
  Flame,
  TrendingUp,
  Clapperboard,
  Compass,
  ArrowRight,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: trendingData, isLoading: isTrendingLoading } = useMovies({
    type: 'trending',
  });
  const { data: topRatedData, isLoading: isTopRatedLoading } = useMovies({
    type: 'top_rated',
  });
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } = useMovies({
    type: 'now_playing',
  });

  const stats = [
    {
      name: 'Movies in Database',
      value: '20,000+',
      icon: <Film className="h-6 w-6" />,
    },
    {
      name: 'Curated Genres',
      value: '19 Categories',
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      name: 'Active Film Buffs',
      value: '10,000+',
      icon: <Heart className="h-6 w-6" />,
    },
    {
      name: 'Average Rating Score',
      value: '4.8 / 5.0',
      icon: <Star className="h-6 w-6" />,
    },
  ];

  const benefits = [
    {
      title: 'Smart AI Discovery',
      description:
        'Our algorithms analyze genre preferences, ratings, and cast members to recommend hidden cinematic gems.',
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: 'Real-Time Streaming Guides',
      description:
        'Instant links to stream, rent, or buy movies directly on Netflix, Prime Video, Apple TV, Disney+, and more.',
      icon: <Tv className="h-6 w-6" />,
    },
    {
      title: 'Personalized Watchlists',
      description:
        'Save any title with one tap to your local watchlist and organize your weekend movie marathons effortlessly.',
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: 'Comprehensive Film Analytics',
      description:
        'Explore cast profiles, directors, box-office revenue, official trailers, and audience reviews in one sleek interface.',
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ];

  const featuredGenres = [
    { id: 28, name: 'Action', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400' },
    { id: 878, name: 'Sci-Fi', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400' },
    { id: 16, name: 'Animation', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400' },
    { id: 35, name: 'Comedy', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400' },
    { id: 18, name: 'Drama', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400' },
    { id: 27, name: 'Horror', color: 'from-rose-500/20 to-red-700/20 border-rose-500/30 text-rose-400' },
    { id: 53, name: 'Thriller', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400' },
    { id: 14, name: 'Fantasy', color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-400' },
  ];

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Trending Movies Carousel */}
      {isTrendingLoading ? (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-60 rounded-xl" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-48 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          title="Trending This Week"
          subtitle="The most popular movies buzzing right now"
          icon={<Flame className="h-6 w-6" />}
          movies={trendingData?.results || []}
          viewAllHref="/search"
        />
      )}

      {/* 3. Quick Browse By Genre Pills */}
      <section className="py-10 border-y border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                Popular Genres
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Jump straight into your favorite cinema categories
              </p>
            </div>
            <Link
              href="/genres"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline group"
            >
              <span>Explore all genres</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredGenres.map((g) => (
              <Link
                key={g.id}
                href={`/genres/${g.id}`}
                className={`p-3 rounded-xl border bg-gradient-to-br ${g.color} hover:scale-105 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm`}
              >
                <span className="text-xs sm:text-sm font-bold">{g.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Rated Masterpieces Carousel */}
      {isTopRatedLoading ? (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-60 rounded-xl" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-48 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          title="Top Rated Masterpieces"
          subtitle="Critically acclaimed films with highest audience scores"
          icon={<Star className="h-6 w-6" />}
          movies={topRatedData?.results || []}
          viewAllHref="/search"
        />
      )}

      {/* 5. In Theatres Now Carousel */}
      {isNowPlayingLoading ? (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-60 rounded-xl" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-48 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          title="In Theatres & Recent"
          subtitle="Fresh releases currently capturing cinema screens"
          icon={<Clapperboard className="h-6 w-6" />}
          movies={nowPlayingData?.results || []}
          viewAllHref="/search"
        />
      )}

      {/* 6. Platform Stats */}
      <section className="py-14 border-t border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s) => (
              <StatCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why MovieQuest Features / Benefits */}
      <section className="py-16 border-t border-border/40 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Engineered for True <span className="text-primary">Film Lovers</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Everything you need to discover, track, and watch unforgettable cinema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <TestimonialSection />
    </main>
  );
}
