'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark / light theme"
      className={cn(
        'p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        theme === 'dark' ? 'text-yellow-300' : 'text-gray-600'
      )}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
