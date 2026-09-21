import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/api';

function formatCurrency(amount: number | undefined) {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function FinancialDetails({ movie }: { movie: Movie }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-foreground">Details</h3>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Release Date</p>
            <p className="text-foreground">{formatDate(movie.release_date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Status</p>
            <p className="text-foreground">{movie.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Budget</p>
            <p className="text-foreground">{formatCurrency(movie.budget)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Revenue</p>
            <p className="text-foreground">{formatCurrency(movie.revenue)}</p>
          </div>
          {movie.spoken_languages && movie.spoken_languages.length > 0 && (
            <div>
              <p className="text-muted-foreground text-sm">Languages</p>
              <p className="text-foreground">
                {movie.spoken_languages.map((lang) => lang.english_name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}