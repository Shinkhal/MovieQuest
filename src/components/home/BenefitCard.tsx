import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LucideStar, LucideSearch, LucideHeart, LucideClock } from 'lucide-react';

/**
 * Small reusable benefit card used on the home page.
 */
export function BenefitCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-surface/10 border border-muted/20 backdrop-blur-sm p-4 hover:border-primary transition-colors"
          >
      <CardContent className="flex items-start space-x-4">
        {icon}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
