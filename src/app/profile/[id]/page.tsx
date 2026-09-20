'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Film,
  Bookmark,
  Star,
  Sparkles,
  Share2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import CinephileCard, { CinephileProfileData, CinephileStats } from '@/components/CinephileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CinephileProfileData | null>(null);
  const [stats, setStats] = useState<CinephileStats>({
    watchlistCount: 0,
    reviewCount: 0,
    averageRating: 0,
  });
  const [watchlistMovies, setWatchlistMovies] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userId)}`);

        if (res.status === 403) {
          setIsPrivate(true);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setStats(data.stats);
          setWatchlistMovies(data.watchlistMovies || []);
          setReviews(data.recentReviews || []);
        } else {
          setIsPrivate(false);
          setProfile(null);
        }
      } catch (err) {
        console.error('Failed to load public profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading Cinephile Passport...
          </p>
        </div>
      </main>
    );
  }

  if (isPrivate) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              This Profile is Private
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              The user has set their Cinephile Passport and Watchlist to private mode.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full h-11 rounded-xl font-semibold gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <Film className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Cinephile Not Found
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              We couldn&apos;t locate a Cinephile Passport matching this user ID.
            </p>
          </div>
          <Link href="/">
            <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Explore MovieQuest
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to MovieQuest</span>
        </Link>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-xs">
          Public Cinephile Showcase
        </Badge>
      </div>

      {/* Main Passport Card Showcase */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {profile.name}&apos;s Passport
          </h1>
          <p className="text-xs text-muted-foreground">
            Curated movie recommendations, taste profile, and public watchlist.
          </p>
        </div>

        <CinephileCard profile={profile} stats={stats} isOwner={false} />
      </section>

      {/* Public Watchlist Section */}
      <section className="space-y-4 pt-6 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <span>Public Watchlist ({watchlistMovies.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Films {profile.name} plans to watch or recommends.
            </p>
          </div>
        </div>

        {watchlistMovies.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-xs text-muted-foreground">
            No public watchlist movies added yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlistMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition duration-200 shadow-md"
              >
                <Link href={`/movie/${movie.id}`}>
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center p-2 text-center text-xs text-muted-foreground">
                        No poster
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    </div>
                  </div>
                </Link>

                <div className="p-3 space-y-1">
                  <Link href={`/movie/${movie.id}`}>
                    <h4 className="text-xs font-bold text-foreground truncate hover:text-primary transition">
                      {movie.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-muted-foreground">
                    {movie.release_date?.slice(0, 4) || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews by User */}
      {reviews.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border/60">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>Recent Film Ratings & Reviews</span>
          </h2>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-md space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/movie/${rev.movieId}`}
                    className="text-sm font-bold text-foreground hover:text-primary transition flex items-center gap-1.5"
                  >
                    <Film className="h-4 w-4 text-primary" />
                    <span>{rev.movieTitle}</span>
                  </Link>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-muted-foreground">
                  Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
