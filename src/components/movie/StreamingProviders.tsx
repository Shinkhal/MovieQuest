'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Tv, ExternalLink, Globe } from 'lucide-react';
import { Movie } from '@/types/api';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

const POPULAR_SERVICES = [
  { name: 'Netflix', query: 'https://www.netflix.com/search?q=' },
  { name: 'Prime Video', query: 'https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=' },
  { name: 'Apple TV', query: 'https://tv.apple.com/search?term=' },
  { name: 'YouTube', query: 'https://www.youtube.com/results?search_query=' },
];

function getImageUrl(path: string | null) {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/w154${path}`;
}

function openStreamingService(providerName: string, movie: Movie) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const providerUrls: Record<string, string> = {
    Netflix: `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
    'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${encodeURIComponent(movie.title)}`,
    'Prime Video': `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${encodeURIComponent(movie.title)}`,
    'Apple TV': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'Apple TV+': `https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`,
    'Disney Plus': `https://www.disneyplus.com/search?q=${encodeURIComponent(movie.title)}`,
    'Disney+': `https://www.disneyplus.com/search?q=${encodeURIComponent(movie.title)}`,
    'Hotstar': `https://www.hotstar.com/in/explore?search_query=${encodeURIComponent(movie.title)}`,
    YouTube: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' movie')}`,
    'Google Play Movies': `https://play.google.com/store/search?q=${encodeURIComponent(movie.title)}&c=movies`,
    Hulu: `https://www.hulu.com/search?q=${encodeURIComponent(movie.title)}`,
    Max: `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    'HBO Max': `https://www.max.com/search?q=${encodeURIComponent(movie.title)}`,
    JioCinema: `https://www.jiocinema.com/search/${encodeURIComponent(movie.title)}`,
    SonyLIV: `https://www.sonyliv.com/search?q=${encodeURIComponent(movie.title)}`,
    Zee5: `https://www.zee5.com/search?q=${encodeURIComponent(movie.title)}`,
  };

  const url =
    providerUrls[providerName] ||
    `https://www.google.com/search?q=where+to+watch+${encodeURIComponent(movie.title)}+${encodeURIComponent(year)}+online`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function StreamingProviders({ movie }: { movie: Movie }) {
  const results = movie.watch_providers?.results || {};
  const availableRegions = Object.keys(results);

  // Preferred regions hierarchy
  const defaultRegion = results.US ? 'US' : results.IN ? 'IN' : results.GB ? 'GB' : availableRegions[0] || '';
  const [selectedRegion, setSelectedRegion] = useState<string>(defaultRegion);

  const regionData = selectedRegion ? results[selectedRegion] : null;
  const flatrate: Provider[] = regionData?.flatrate || [];
  const rent: Provider[] = regionData?.rent || [];
  const buy: Provider[] = regionData?.buy || [];

  const hasWatchData = flatrate.length > 0 || rent.length > 0 || buy.length > 0;

  return (
    <div className="mt-8 border-t border-border/40 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Tv className="h-5 w-5 text-primary" />
          Where to Watch
        </h3>

        {/* Region selector if multiple regions available */}
        {availableRegions.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-card border border-border/80 rounded-lg px-2.5 py-1 text-xs text-foreground outline-none focus:border-primary"
            >
              {availableRegions.map((code) => (
                <option key={code} value={code}>
                  Region: {code}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasWatchData ? (
        <div className="space-y-6">
          {flatrate.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Stream Subscription
              </h4>
              <div className="flex flex-wrap gap-3">
                {flatrate.map((provider) => (
                  <button
                    key={provider.provider_id}
                    onClick={() => openStreamingService(provider.provider_name, movie)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/50 transition-all text-left shadow-sm group"
                  >
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-background border border-border/40 flex-shrink-0">
                      {provider.logo_path ? (
                        <Image
                          src={getImageUrl(provider.logo_path)}
                          alt={provider.provider_name}
                          fill
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <Tv className="h-4 w-4 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block">
                        {provider.provider_name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Watch Now</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {rent.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Rent Digital
              </h4>
              <div className="flex flex-wrap gap-3">
                {rent.slice(0, 6).map((provider) => (
                  <button
                    key={provider.provider_id}
                    onClick={() => openStreamingService(provider.provider_name, movie)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition text-left"
                  >
                    <div className="relative w-7 h-7 rounded-md overflow-hidden bg-background border border-border/30 flex-shrink-0">
                      {provider.logo_path ? (
                        <Image
                          src={getImageUrl(provider.logo_path)}
                          alt={provider.provider_name}
                          fill
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <Tv className="h-3.5 w-3.5 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {provider.provider_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {buy.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Buy Digital
              </h4>
              <div className="flex flex-wrap gap-3">
                {buy.slice(0, 6).map((provider) => (
                  <button
                    key={provider.provider_id}
                    onClick={() => openStreamingService(provider.provider_name, movie)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition text-left"
                  >
                    <div className="relative w-7 h-7 rounded-md overflow-hidden bg-background border border-border/30 flex-shrink-0">
                      {provider.logo_path ? (
                        <Image
                          src={getImageUrl(provider.logo_path)}
                          alt={provider.provider_name}
                          fill
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <Tv className="h-3.5 w-3.5 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {provider.provider_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Direct streaming availability varies by region. You can search across popular streaming platforms:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {POPULAR_SERVICES.map((srv) => (
              <button
                key={srv.name}
                onClick={() => openStreamingService(srv.name, movie)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/80 text-xs font-medium text-foreground/90 hover:text-primary hover:border-primary/50 transition-all"
              >
                <span>{srv.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}