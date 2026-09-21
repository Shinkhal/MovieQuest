import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Film, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary mb-6">
        <Film className="h-12 w-12" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
        404 - Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8">
        The movie or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button size="lg" className="rounded-xl bg-primary text-primary-foreground font-semibold gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/search">
          <Button size="lg" variant="outline" className="rounded-xl border-border/80">
            Browse Movies
          </Button>
        </Link>
      </div>
    </div>
  );
}
