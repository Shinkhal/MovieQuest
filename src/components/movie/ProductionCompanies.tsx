import Image from 'next/image';
import { Movie } from '@/types/api';

function getImageUrl(path: string | null) {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/w154${path}`;
}

export function ProductionCompanies({ movie }: { movie: Movie }) {
  if (!movie.production_companies || movie.production_companies.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">Production</h3>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          {movie.production_companies.map((company) => (
            <div key={company.id} className="flex items-center gap-2">
              {company.logo_path ? (
                <Image
                  src={getImageUrl(company.logo_path)}
                  alt={company.name}
                  width={32}
                  height={32}
                  className="object-contain bg-background p-1 rounded"
                />
              ) : null}
              <span className="text-muted-foreground text-sm">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}