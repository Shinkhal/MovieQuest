'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Sparkles, User, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn('google', { callbackUrl });
  };

  const handleGuestSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setLoading(true);
    signIn('credentials', {
      name: guestName,
      callbackUrl,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-amber-500 shadow-md text-white">
              <Film className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Movie<span className="text-primary">Quest</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Welcome to MovieQuest
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to sync your personalized watchlist, post movie reviews, and access tailored recommendations.
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full py-6 rounded-2xl border-border/80 hover:bg-muted font-semibold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          <div className="relative flex items-center justify-center text-xs uppercase">
            <div className="w-full border-t border-border/60" />
            <span className="bg-card px-3 text-muted-foreground font-medium">Or Quick Guest Login</span>
            <div className="w-full border-t border-border/60" />
          </div>

          {/* Quick Cinephile Form */}
          <form onSubmit={handleGuestSignIn} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                Your Cinephile Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Christopher Nolan"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="rounded-xl bg-background/70 border-border/80"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95 gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Sign In as Guest Cinephile</span>
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          By signing in, you agree to MovieQuest’s community guidelines and review standards.
        </p>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
