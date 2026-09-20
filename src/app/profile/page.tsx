'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Bookmark,
  MessageSquare,
  Sparkles,
  Share2,
  Edit3,
  Star,
  Film,
  Globe,
  Lock,
  Save,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import CinephileCard, { CinephileProfileData, CinephileStats } from '@/components/CinephileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWatchlist } from '@/hooks/useWatchlist';
import { getAppBaseUrl } from '@/lib/utils';

const AVAILABLE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

const AVATAR_STYLES = [
  'FilmBuff',
  'CinemaLover',
  'DirectorCut',
  'Screenwriter',
  'PopcornFan',
  'MidnightCritic',
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const [activeTab, setActiveTab] = useState<'passport' | 'watchlist' | 'reviews' | 'edit'>('passport');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState<CinephileProfileData>({
    userId: '',
    name: '',
    email: '',
    image: '',
    bio: '',
    favoriteMovie: '',
    favoriteGenres: ['Sci-Fi', 'Drama'],
    rankBadge: 'Novice Filmgoer 🎟️',
    twitterUsername: '',
    letterboxdUsername: '',
    isPublic: true,
  });

  const [stats, setStats] = useState<CinephileStats>({
    watchlistCount: 0,
    reviewCount: 0,
    averageRating: 0,
  });

  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Form edit state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    favoriteMovie: '',
    favoriteGenres: [] as string[],
    twitterUsername: '',
    letterboxdUsername: '',
    isPublic: true,
    image: '',
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setStats(data.stats);
        setUserReviews(data.recentReviews || []);
        setFormData({
          name: data.profile.name || '',
          bio: data.profile.bio || '',
          favoriteMovie: data.profile.favoriteMovie || '',
          favoriteGenres: data.profile.favoriteGenres || ['Sci-Fi'],
          twitterUsername: data.profile.twitterUsername || '',
          letterboxdUsername: data.profile.letterboxdUsername || '',
          isPublic: data.profile.isPublic !== false,
          image: data.profile.image || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        toast.success('Cinephile Profile updated successfully! 🎬');
        setActiveTab('passport');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      const exists = prev.favoriteGenres.includes(genre);
      if (exists) {
        return { ...prev, favoriteGenres: prev.favoriteGenres.filter((g) => g !== genre) };
      }
      if (prev.favoriteGenres.length >= 5) {
        toast.error('You can choose up to 5 favorite genres.');
        return prev;
      }
      return { ...prev, favoriteGenres: [...prev.favoriteGenres, genre] };
    });
  };

  const handleCopyLink = () => {
    const baseUrl = getAppBaseUrl();
    const url = `${baseUrl}/profile/${encodeURIComponent(profile.userId || session?.user?.id || '')}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Public Passport URL copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your Cinephile Profile...
          </p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign In to View Your Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in with Google to customize your Cinephile Passport, sync your cloud watchlist, and share your taste with friends.
            </p>
          </div>
          <Link href="/auth/signin">
            <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25">
              Sign In with Google
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Profile Header Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-primary/50 shadow-xl bg-primary/10 flex-shrink-0">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-extrabold text-primary">
                  {profile.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {profile.name || 'Film Buff'}
                </h1>
                <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                  {profile.rankBadge}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-foreground/80 max-w-xl leading-relaxed pt-1">
                {profile.bio || 'Exploring cinema one frame at a time on MovieQuest.'}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {profile.isPublic ? (
                    <>
                      <Globe className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Public Passport</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Private Profile</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="rounded-xl border-border hover:bg-muted text-xs font-semibold h-9 gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5 text-primary" />}
              <span>{copied ? 'Copied' : 'Share Link'}</span>
            </Button>

            <Button
              onClick={() => setActiveTab(activeTab === 'edit' ? 'passport' : 'edit')}
              size="sm"
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 gap-1.5 shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{activeTab === 'edit' ? 'View Passport' : 'Edit Profile'}</span>
            </Button>
          </div>
        </div>

        {/* Aggregate Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border/50 text-center">
          <div className="p-3 rounded-2xl bg-background/40 border border-border/40">
            <p className="text-xl sm:text-2xl font-extrabold text-foreground">{stats.watchlistCount}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Watchlisted Films</p>
          </div>
          <div className="p-3 rounded-2xl bg-background/40 border border-border/40">
            <p className="text-xl sm:text-2xl font-extrabold text-amber-500">{stats.reviewCount}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Reviews & Ratings</p>
          </div>
          <div className="p-3 rounded-2xl bg-background/40 border border-border/40">
            <p className="text-xl sm:text-2xl font-extrabold text-primary">
              {stats.averageRating > 0 ? `${stats.averageRating} / 5.0` : '—'}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Average Score Given</p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'passport'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Cinephile Passport</span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'watchlist'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>My Watchlist ({stats.watchlistCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'reviews'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>My Reviews ({stats.reviewCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'edit'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>Customize Profile</span>
        </button>
      </div>

      {/* Tab 1: Cinephile Passport */}
      {activeTab === 'passport' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h2 className="text-xl font-bold text-foreground">Your Cinephile Passport</h2>
            <p className="text-xs text-muted-foreground">
              Share your cinematic identity, favorite movie, and watch metrics with fellow film lovers.
            </p>
          </div>

          <CinephileCard profile={profile} stats={stats} isOwner={true} />

          {/* Direct Public Link Box */}
          <div className="max-w-lg mx-auto p-4 rounded-2xl border border-border/60 bg-muted/30 flex items-center justify-between gap-3 text-xs">
            <div className="truncate text-muted-foreground">
              <span className="font-semibold text-foreground">Share URL: </span>
              <span>{`${getAppBaseUrl()}/profile/${encodeURIComponent(profile.userId || '')}`}</span>
            </div>
            <Button
              onClick={handleCopyLink}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-lg text-xs font-semibold flex-shrink-0"
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: My Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Saved Cloud Watchlist</h2>
              <p className="text-xs text-muted-foreground">
                All movies saved to your account across devices.
              </p>
            </div>
            <Link href="/watchlist">
              <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1">
                <span>Manage Watchlist</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border bg-card/40 p-8 space-y-4">
              <Bookmark className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">Your watchlist is currently empty</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore popular blockbusters and indie gems to build your personalized film queue.
              </p>
              <Link href="/search">
                <Button size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs">
                  Discover Movies
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlist.map((movie) => (
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
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>{movie.release_date?.slice(0, 4) || '—'}</span>
                      <button
                        onClick={() => {
                          removeFromWatchlist(movie.id);
                          toast.success(`Removed ${movie.title} from watchlist`);
                        }}
                        className="text-rose-500 hover:text-rose-600 p-1 hover:bg-rose-500/10 rounded transition"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Movie Reviews</h2>
            <p className="text-xs text-muted-foreground">
              Reviews and ratings you have contributed to the MovieQuest community.
            </p>
          </div>

          {userReviews.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border bg-card/40 p-8 space-y-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No reviews written yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Watch any movie and write your first review to earn Cinephile points and badges!
              </p>
              <Link href="/search">
                <Button size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs">
                  Find Movies to Review
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-2xl border border-border bg-card/70 backdrop-blur-md space-y-2.5 shadow-sm"
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
          )}
        </div>
      )}

      {/* Tab 4: Customize Profile */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Customize Your Cinephile Profile</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Personalize your taste signature, all-time favorite movie, and social handles.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Nolan Enthusiast"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Bio / Cinema Philosophy
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                maxLength={300}
                className="w-full p-3 rounded-xl border border-border bg-background/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                placeholder="Share your favorite directors, genres, and movie philosophy..."
              />
              <p className="text-[11px] text-muted-foreground text-right">{formData.bio.length} / 300</p>
            </div>

            {/* Favorite Movie of All Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                All-Time Favorite Movie
              </label>
              <input
                type="text"
                value={formData.favoriteMovie}
                onChange={(e) => setFormData({ ...formData, favoriteMovie: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Interstellar (2014) or Pulp Fiction (1994)"
              />
            </div>

            {/* Favorite Genres Multi-Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Favorite Genres (Up to 5)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {formData.favoriteGenres.length} / 5 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_GENRES.map((genre) => {
                  const isSelected = formData.favoriteGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {isSelected ? `✓ ${genre}` : `+ ${genre}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Twitter / X Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={formData.twitterUsername}
                    onChange={(e) => setFormData({ ...formData, twitterUsername: e.target.value })}
                    className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-background/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="cinemabuff"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Letterboxd Username
                </label>
                <input
                  type="text"
                  value={formData.letterboxdUsername}
                  onChange={(e) => setFormData({ ...formData, letterboxdUsername: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="letterboxd_user"
                />
              </div>
            </div>

            {/* Avatar Style Quick Switch */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Avatar Persona
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_STYLES.map((seed) => {
                  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                  const isCurrent = formData.image === avatarUrl;
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: avatarUrl })}
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition ${
                        isCurrent
                          ? 'border-primary bg-primary/10'
                          : 'border-border/60 hover:bg-muted/50'
                      }`}
                    >
                      <div className="relative h-7 w-7 rounded-lg overflow-hidden bg-primary/20">
                        <Image src={avatarUrl} alt={seed} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{seed}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Public Sharing Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/30">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Public Cinephile Passport</p>
                <p className="text-[11px] text-muted-foreground">
                  Allow others to view your passport card and public watchlist with your share link.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('passport')}
                className="rounded-xl h-10 px-5 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25 gap-2"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
