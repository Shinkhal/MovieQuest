'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Sidebar that lists all genres and highlights the active one.
 * Used on the individual genre page.
 */
export function GenreSidebar({ genres }: { genres: { id: number; name: string }[] }) {
  const params = useParams();
  const activeId = parseInt(params.id as string, 10);

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="bg-surface/10 border border-muted/20 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Browse Genres</h2>
        <ul className="space-y-1">
          {genres.map((genre) => (
            <li key={genre.id}>
              <Link
                href={`/genres/${genre.id}`}
                className={cn(
                  'block px-3 py-2 rounded-md transition-colors',
                  genre.id === activeId
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                )}
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}