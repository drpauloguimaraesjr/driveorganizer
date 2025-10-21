import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { EnhancedFilterPanel, EnhancedFilterValues } from "@/components/EnhancedFilterPanel";
import { DetailedResultCard, DetailedSearchResult } from "@/components/DetailedResultCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AVAILABLE_YEARS = ["2024", "2023", "2022", "2021", "2020"];
const AVAILABLE_THEMES = ["Endocrinologia", "Cardiologia", "Oncologia", "Neurologia", "Gastroenterologia"];
const AVAILABLE_STUDY_TYPES = ["RCT", "Cohort", "Case-control", "Systematic Review", "Meta-analysis"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<EnhancedFilterValues>({ ano: "", tema: "", tipo_estudo: "" });
  const [results, setResults] = useState<DetailedSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async ({ q, filtros }: { q: string; filtros: EnhancedFilterValues }) => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q, filtros }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      setHasSearched(true);
      
      if (data.sources && data.sources.length > 0) {
        const transformedResults: DetailedSearchResult[] = data.sources.map((source: any, index: number) => {
          const metadata = source.metadata?.identificacao || {};
          return {
            id: `result-${index}`,
            titulo: metadata.titulo || "Sem título",
            ano: metadata.ano || new Date().getFullYear(),
            autores: metadata.autores,
            periodico: metadata.periodico,
            tipo_estudo: metadata.tipo_estudo,
            area_tema: metadata.area_tema,
            doi: metadata.doi,
            metodos: source.metadata?.metodos,
            resultados: source.metadata?.resultados,
            seguranca: source.metadata?.seguranca,
            conclusao_clinica: source.metadata?.conclusao_clinica || "",
            resumo_teleprompter: source.metadata?.resumo_teleprompter,
            referencias: source.metadata?.referencias,
            excerpt: source.excerpt || data.content,
          };
        });
        setResults(transformedResults);
      } else {
        setResults([]);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
      setResults([]);
      setHasSearched(true);
    },
  });

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, insira uma pergunta ou termo de busca.",
        variant: "destructive",
      });
      return;
    }
    
    searchMutation.mutate({ q: query, filtros: filters });
  };

  const handleClearFilters = () => {
    setFilters({ ano: "", tema: "", tipo_estudo: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Document Search</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Research</p>
              </div>
            </div>
            <Navigation />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
            />
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || searchMutation.isPending}
                data-testid="button-search"
              >
                {searchMutation.isPending ? "Pesquisando..." : "Pesquisar"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <EnhancedFilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
              availableYears={AVAILABLE_YEARS}
              availableThemes={AVAILABLE_THEMES}
              availableStudyTypes={AVAILABLE_STUDY_TYPES}
            />
          </aside>

          <div className="lg:col-span-3">
            {searchMutation.isPending ? (
              <LoadingSkeleton />
            ) : !hasSearched ? (
              <EmptyState variant="initial" />
            ) : results.length === 0 ? (
              <EmptyState variant="no-results" query={query} />
            ) : (
              <div className="space-y-4" data-testid="results-list">
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((result) => (
                  <DetailedResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
