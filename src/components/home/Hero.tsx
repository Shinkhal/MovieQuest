import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideSearch, LucideFilm, LucideHeart, LucideStar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hero section for the home page. Rendered as a Server Component.
 * Uses the new semantic colour tokens from tailwind.config.ts.
 */
export default function Hero() {
  return (
    <section className="relative min-h-[70vh] bg-gradient-to-b from-primary to-background flex items-center justify-center px-6 py-12">
      {/* Optional background image – keep it light to preserve performance */}
      <div className="absolute inset-0 opacity-10">
        {/* placeholder gradient / pattern could go here */}
      </div>
      <div className="z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Discover Your Next Favorite Film
        </h1>
        <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
          MovieQuest uses AI‑powered recommendations to match your taste, mood and streaming
          preferences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link href="/search">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/80">
              <LucideSearch className="mr-2 h-5 w-5" /> Explore Movies
            </Button>
          </Link>
          <Link href="/genres">
            <Button size="lg" variant="outline" className="border-muted text-muted hover:bg-muted/20">
              <LucideFilm className="mr-2 h-5 w-5" /> Browse Genres
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
