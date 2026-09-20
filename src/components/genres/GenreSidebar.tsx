'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function GenreSidebar({ genres }: { genres: { id: number; name: string }[] }) {
  const params = useParams();
  const activeId = parseInt(params.id as string, 10);
  const [filter, setFilter] = useState('');

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase().trim())
  );

  return (
    <>
      {/* Mobile Horizontal Carousel */}
      <div className="md:hidden w-full overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center gap-2">
          {genres.map((genre) => {
            const isActive = genre.id === activeId;
            return (
              <Link
                key={genre.id}
                href={`/genres/${genre.id}`}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm border',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card/70 border-border/70 text-muted-foreground hover:text-foreground'
                )}
              >
                {genre.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              All Genres
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
              {genres.length}
            </span>
          </div>

          {/* Search box for genres */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter genres..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/40 border-border/60 rounded-lg"
            />
          </div>

          {/* Genres List */}
          <nav className="max-h-[60vh] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredGenres.map((genre) => {
              const isActive = genre.id === activeId;
              return (
                <Link
                  key={genre.id}
                  href={`/genres/${genre.id}`}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <span>{genre.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
            {filteredGenres.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No genre matching "{filter}"
              </p>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}