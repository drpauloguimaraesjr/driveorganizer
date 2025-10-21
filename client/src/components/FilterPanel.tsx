import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FilterValues {
  ano: string;
  tema: string;
}

interface FilterPanelProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
  availableYears?: string[];
  availableThemes?: string[];
}

export function FilterPanel({ 
  filters, 
  onChange, 
  onClear,
  availableYears = [],
  availableThemes = []
}: FilterPanelProps) {
  const hasActiveFilters = filters.ano || filters.tema;

  const handleYearChange = (year: string) => {
    onChange({ ...filters, ano: filters.ano === year ? "" : year });
  };

  const handleThemeChange = (theme: string) => {
    onChange({ ...filters, tema: filters.tema === theme ? "" : theme });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            data-testid="button-clear-filters"
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Ano</Label>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <Badge
                key={year}
                variant={filters.ano === year ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => handleYearChange(year)}
                data-testid={`filter-year-${year}`}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Área/Tema</Label>
          <div className="flex flex-wrap gap-2">
            {availableThemes.map((theme) => (
              <Badge
                key={theme}
                variant={filters.tema === theme ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => handleThemeChange(theme)}
                data-testid={`filter-theme-${theme}`}
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t">
          <Label className="text-sm font-medium mb-3 block">Filtros Ativos</Label>
          <div className="flex flex-wrap gap-2">
            {filters.ano && (
              <Badge variant="secondary" className="gap-1" data-testid="active-filter-year">
                Ano: {filters.ano}
                <button
                  onClick={() => onChange({ ...filters, ano: "" })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove year filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.tema && (
              <Badge variant="secondary" className="gap-1" data-testid="active-filter-theme">
                Tema: {filters.tema}
                <button
                  onClick={() => onChange({ ...filters, tema: "" })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove theme filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
