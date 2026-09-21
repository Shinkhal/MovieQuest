'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Movie } from '@/types/api';
import { ResultCard } from '@/components/search/ResultCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  movies: Movie[];
  viewAllHref?: string;
}

export function MovieCarousel({
  title,
  subtitle,
  icon,
  movies,
  viewAllHref = '/search',
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {icon && <span className="text-primary">{icon}</span>}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll buttons */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="h-8 w-8 rounded-full border-border/80 hover:bg-muted"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="h-8 w-8 rounded-full border-border/80 hover:bg-muted"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline group"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-[170px] sm:w-[210px] md:w-[230px] flex-shrink-0 snap-start"
            >
              <ResultCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
