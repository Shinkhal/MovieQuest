import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Card representing a single genre on the Genres index page.
 */
export function GenreCard({ genre }: { genre: { id: number; name: string } }) {
  // Simple pastel gradient based on genre id (just for demo)
  const bgClass = `bg-gradient-to-r from-indigo-500 to-purple-600`;
  return (
    <Link href={`/genres/${genre.id}`} className="block">
      <Card className={cn('overflow-hidden hover:shadow-xl transition-shadow', bgClass)}>
        <div className="h-32 flex items-center justify-center">
          <h2 className="text-xl font-bold text-white">{genre.name}</h2>
        </div>
      </Card>
    </Link>
  );
}
