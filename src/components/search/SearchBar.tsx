'use client';

import React, { useState, useEffect } from 'react';
import { Search as LucideSearch, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SearchBar({
  initialValue = '',
  onSearch,
}: {
  initialValue?: string;
  onSearch: (term: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  // Sync internal state if initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-border/80 bg-card/80 backdrop-blur-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="pl-4 text-muted-foreground pointer-events-none">
          <LucideSearch className="h-5 w-5" />
        </div>
        <Input
          type="text"
          placeholder="Search by movie title, franchise, or keywords..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-14 pl-3 pr-24 bg-transparent border-0 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            size="sm"
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-transform active:scale-95"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
