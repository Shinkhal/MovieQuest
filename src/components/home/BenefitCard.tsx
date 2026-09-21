import { Card, CardContent } from '@/components/ui/card';

export function BenefitCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="group relative rounded-2xl border border-border/60 bg-card/60 hover:bg-card/90 backdrop-blur-md p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl shadow-sm">
      <CardContent className="p-0 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
