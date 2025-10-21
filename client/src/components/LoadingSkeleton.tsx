import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 animate-pulse" data-testid={`skeleton-${i}`}>
          <div className="flex items-start gap-4">
            <div className="h-9 w-9 bg-muted rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/5" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
