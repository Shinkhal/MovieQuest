import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search as LucideSearch, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Search bar component used on the movies search page.
 * It calls `onSearch(term)` when the Search button is clicked or Enter is pressed.
 */
export function SearchBar({
  initialValue = '',
  onSearch,
}: {
  initialValue?: string;
  onSearch: (term: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value.trim());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl mx-auto">
      <div className="relative flex-grow">
        <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="search"
          placeholder="Search for movies…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 py-6 bg-background border border-muted rounded-xl focus:border-primary"
        />
        {value && (
          <button
            onClick={() => setValue('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>
      <Button onClick={() => onSearch(value.trim())} className="bg-primary hover:bg-primary/80 text-primary-foreground">
        <LucideSearch className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
}
