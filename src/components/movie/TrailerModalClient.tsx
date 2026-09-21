'use client';

import { useState, useEffect } from 'react';
import { TrailerModal } from '@/components/movie/TrailerModal';

interface TrailerModalClientProps {
  trailerKey: string | null;
}

export function TrailerModalClient({ trailerKey }: TrailerModalClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenTrailer = (e: CustomEvent<string>) => {
      if (e.detail) setIsOpen(true);
    };
    window.addEventListener('open-trailer', handleOpenTrailer as EventListener);
    return () => window.removeEventListener('open-trailer', handleOpenTrailer as EventListener);
  }, []);

  if (!trailerKey) return null;

  return (
    <TrailerModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trailerKey={trailerKey}
    />
  );
}