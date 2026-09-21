import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail, Film, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-lg text-foreground/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-amber-500 shadow-sm text-white">
                <Film className="h-4 w-4" />
              </div>
              <span>
                Movie<span className="text-primary">Quest</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your gateway to cinema. Discover trending movies, top-rated masterpieces, and tailored recommendations with where-to-watch streaming guides.
            </p>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Popular Releases
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-primary transition-colors">
                  Browse by Genre
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-primary transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Genres */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">Genres</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/genres/28" className="hover:text-primary transition-colors">
                  Action & Adventure
                </Link>
              </li>
              <li>
                <Link href="/genres/878" className="hover:text-primary transition-colors">
                  Sci-Fi & Fantasy
                </Link>
              </li>
              <li>
                <Link href="/genres/35" className="hover:text-primary transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/genres/18" className="hover:text-primary transition-colors">
                  Drama
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">Connect</h4>
            <p className="text-xs text-muted-foreground">
              Built with Next.js, TypeScript, Tailwind CSS, and TMDB API.
            </p>
            <div className="flex items-center space-x-3">
              <Link
                href="https://github.com/Shinkhal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Github size={18} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/shinkhal-sinha/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="mailto:shinkhalsinha@gmail.com"
                aria-label="Email"
                className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Mail size={18} />
              </Link>
              <Link
                href="https://www.instagram.com/shinkhal_sinha_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} MovieQuest. Created by Shinkhal Sinha.</p>
          <p className="flex items-center gap-1">
            Data provided by <Link href="https://www.themoviedb.org/" target="_blank" className="underline hover:text-primary">TMDB</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
