import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideStar, LucideSearch, LucideHeart, LucideClock } from 'lucide-react';

/**
 * Small reusable stat card used on the home page.
 */
export function StatCard({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-surface/10 border border-muted/20 backdrop-blur-sm p-4 hover:border-primary transition-colors">
      <CardContent className="flex items-center space-x-4">
        {icon}
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {value}
          </CardTitle>
          <CardDescription className="text-muted">
            {name}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
