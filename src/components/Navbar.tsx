'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  Bookmark,
  Film,
  Compass,
  MessageSquare,
  PhoneCall,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { count: watchlistCount, isLoaded } = useWatchlist();

  const navLinks = [
    { href: '/', label: 'Home', icon: Film },
    { href: '/search', label: 'Explore', icon: Compass },
    { href: '/genres', label: 'Genres', icon: Sparkles },
    { href: '/testimonials', label: 'Reviews', icon: MessageSquare },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-3.5 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-amber-500 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Movie<span className="text-primary">Quest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Watchlist, Auth, Theme Toggle, Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Watchlist Link */}
          <Link
            href="/watchlist"
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
              pathname === '/watchlist'
                ? 'bg-primary/10 text-primary border-primary/30 font-semibold'
                : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40'
            )}
            title="My Watchlist"
          >
            <Bookmark className="h-4 w-4 fill-current text-primary" />
            <span className="hidden sm:inline text-xs font-semibold">Watchlist</span>
            {isLoaded && watchlistCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold leading-none flex items-center justify-center">
                {watchlistCount}
              </Badge>
            )}
          </Link>

          {/* User Auth: Sign In or Profile Avatar */}
          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-border/80 bg-card hover:bg-muted transition-colors focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="relative h-7 w-7 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-bold text-primary">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-xs font-bold text-foreground truncate">
                      {session.user.name || 'Cinephile'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-primary" />
                    <span>My Cinephile Profile</span>
                  </Link>
                  <Link
                    href="/watchlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-primary" />
                    <span>My Cloud Watchlist</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button
                size="sm"
                className="h-8 sm:h-9 px-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}

          {/* Theme Switcher */}
          <div className="border-l border-border/60 pl-1.5">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-6 py-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {session?.user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs font-bold text-primary">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-foreground truncate">
                  {session.user.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}

          {session?.user && (
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition',
                pathname === '/profile'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <UserIcon className="h-4 w-4 text-primary" />
              <span>My Cinephile Profile</span>
            </Link>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/watchlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition',
              pathname === '/watchlist'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="h-4 w-4 text-primary" />
              <span>Watchlist</span>
            </div>
            {watchlistCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                {watchlistCount}
              </Badge>
            )}
          </Link>

          {session?.user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Google</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
