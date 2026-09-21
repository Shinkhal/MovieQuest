import { Card, CardContent } from '@/components/ui/card';

export function StatCard({
  name,
  value,
  icon,
}: {
  name: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="group relative rounded-2xl border border-border/60 bg-card/60 hover:bg-card/90 backdrop-blur-md p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg shadow-sm">
      <CardContent className="p-0 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {value}
          </div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">
            {name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
