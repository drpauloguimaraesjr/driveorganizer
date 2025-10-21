import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export interface SearchResult {
  id: string;
  title: string;
  year?: string;
  theme?: string;
  excerpts: string[];
  relevanceScore?: number;
}

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="p-6 hover-elevate transition-all duration-200" data-testid={`result-card-${result.id}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2" data-testid={`result-title-${result.id}`}>
            {result.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {result.year && (
              <Badge variant="secondary" className="text-xs" data-testid={`result-year-${result.id}`}>
                {result.year}
              </Badge>
            )}
            {result.theme && (
              <Badge variant="outline" className="text-xs" data-testid={`result-theme-${result.id}`}>
                {result.theme}
              </Badge>
            )}
            {result.relevanceScore && (
              <Badge variant="outline" className="text-xs">
                {Math.round(result.relevanceScore * 100)}% relevante
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {result.excerpts.map((excerpt, index) => (
              <div key={index} className="flex gap-2 text-sm" data-testid={`result-excerpt-${result.id}-${index}`}>
                <span className="text-muted-foreground flex-shrink-0">•</span>
                <p className="text-foreground/90">{excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
