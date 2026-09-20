'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Film,
  Sparkles,
  Bookmark,
  MessageSquare,
  Star,
  Share2,
  Check,
  Twitter,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAppBaseUrl } from '@/lib/utils';

export interface CinephileProfileData {
  userId: string;
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  favoriteMovie?: string;
  favoriteGenres?: string[];
  rankBadge?: string;
  twitterUsername?: string;
  letterboxdUsername?: string;
  isPublic?: boolean;
}

export interface CinephileStats {
  watchlistCount: number;
  reviewCount: number;
  averageRating: number;
}

interface CinephileCardProps {
  profile: CinephileProfileData;
  stats: CinephileStats;
  isOwner?: boolean;
}

export default function CinephileCard({
  profile,
  stats,
  isOwner = false,
}: CinephileCardProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = getAppBaseUrl();
  const shareUrl = profile.userId ? `${baseUrl}/profile/${encodeURIComponent(profile.userId)}` : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Passport link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = `Check out my Cinephile Passport on MovieQuest! 🎬🍿\nTop Pick: ${profile.favoriteMovie || 'Cinema'}\nRank: ${profile.rankBadge || 'Film Buff'}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative group w-full max-w-lg mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-amber-500/30 to-purple-600/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />

      {/* Main holographic card container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-card/90 dark:bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl transition-all duration-300">
        
        {/* Holographic accent shimmer line */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/30 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-amber-500/20 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Header: Logo + Passport Title */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <Film className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                Official MovieQuest Passport
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Cinephile Identity Card
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          >
            {profile.rankBadge || 'Film Buff 🍿'}
          </Badge>
        </div>

        {/* Profile Details: Avatar, Name, Bio */}
        <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/40 bg-primary/10 shadow-lg flex-shrink-0">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xl font-bold text-primary">
                {profile.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h3 className="text-lg font-bold text-foreground truncate">
                {profile.name || 'Anonymous Cinephile'}
              </h3>
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {profile.bio || 'Exploring cinema one frame at a time on MovieQuest.'}
            </p>

            {/* Social handles if provided */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
              {profile.twitterUsername && (
                <a
                  href={`https://twitter.com/${profile.twitterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition"
                >
                  <Twitter className="h-3 w-3" />
                  <span>@{profile.twitterUsername}</span>
                </a>
              )}
              {profile.letterboxdUsername && (
                <a
                  href={`https://letterboxd.com/${profile.letterboxdUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>letterboxd/{profile.letterboxdUsername}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Favorite Movie Spotlight */}
        <div className="mt-4 p-3 rounded-2xl bg-muted/40 border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            All-Time Favorite Movie
          </p>
          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{profile.favoriteMovie || 'Interstellar (2014)'}</span>
          </p>
        </div>

        {/* Favorite Genres Chips */}
        {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Taste Signature
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.favoriteGenres.map((genre, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Live Aggregate Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border/50 text-center">
          <div className="p-2 rounded-xl bg-background/50 border border-border/40">
            <div className="flex items-center justify-center gap-1 text-primary mb-0.5">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="text-sm font-extrabold">{stats.watchlistCount}</span>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Watchlisted</p>
          </div>

          <div className="p-2 rounded-xl bg-background/50 border border-border/40">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-sm font-extrabold">{stats.reviewCount}</span>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Reviews</p>
          </div>

          <div className="p-2 rounded-xl bg-background/50 border border-border/40">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="text-sm font-extrabold">
                {stats.averageRating > 0 ? `${stats.averageRating}★` : '—'}
              </span>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Avg Rating</p>
          </div>
        </div>

        {/* Actions Bar: Copy Link & Share */}
        <div className="mt-5 flex items-center gap-2 pt-2">
          <Button
            onClick={handleCopyLink}
            size="sm"
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 gap-1.5 shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
          </Button>

          <Button
            onClick={handleShareTwitter}
            size="sm"
            variant="outline"
            className="rounded-xl border-border/80 hover:bg-muted text-xs font-semibold h-9 px-3 gap-1.5"
            title="Share on X (Twitter)"
          >
            <Twitter className="h-3.5 w-3.5 text-[#1DA1F2]" />
            <span className="hidden sm:inline">Tweet</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
