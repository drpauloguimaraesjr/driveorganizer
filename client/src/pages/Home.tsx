import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel, FilterValues } from "@/components/FilterPanel";
import { ResultCard, SearchResult } from "@/components/ResultCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

//todo: remove mock functionality
const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "Transformação Digital na Saúde Pública",
    year: "2024",
    theme: "Saúde",
    excerpts: [
      "A implementação de prontuários eletrônicos reduziu o tempo de atendimento em 35%",
      "Telemedicina expandiu o acesso a especialistas em regiões remotas",
      "Inteligência artificial auxiliou no diagnóstico precoce de 12.000 casos"
    ],
    relevanceScore: 0.95
  },
  {
    id: "2",
    title: "Análise de Mercado: Tecnologias Emergentes",
    year: "2023",
    theme: "Tecnologia",
    excerpts: [
      "Cloud computing apresentou crescimento de 47% no setor empresarial",
      "Investimentos em IA generativa superaram US$ 21 bilhões no primeiro semestre",
      "Blockchain está sendo adotado por 60% das instituições financeiras pesquisadas"
    ],
    relevanceScore: 0.88
  },
  {
    id: "3",
    title: "Educação Digital: Desafios e Oportunidades",
    year: "2024",
    theme: "Educação",
    excerpts: [
      "Plataformas de ensino online alcançaram 2.3 milhões de estudantes",
      "Gamificação aumentou o engajamento estudantil em 42%",
      "Ferramentas adaptativas personalizaram o aprendizado para diferentes perfis"
    ],
    relevanceScore: 0.82
  }
];

const AVAILABLE_YEARS = ["2024", "2023", "2022", "2021", "2020"];
const AVAILABLE_THEMES = ["Tecnologia", "Saúde", "Educação", "Economia", "Meio Ambiente"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ ano: "", tema: "" });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    console.log("Search triggered:", { query, filters });
    setIsLoading(true);
    setHasSearched(true);

    //todo: remove mock functionality
    setTimeout(() => {
      let filteredResults = MOCK_RESULTS;
      
      if (filters.ano) {
        filteredResults = filteredResults.filter(r => r.year === filters.ano);
      }
      
      if (filters.tema) {
        filteredResults = filteredResults.filter(r => r.theme === filters.tema);
      }
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearFilters = () => {
    setFilters({ ano: "", tema: "" });
    console.log("Filters cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Document Search</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Research</p>
            </div>
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
                disabled={!query.trim() || isLoading}
                data-testid="button-search"
              >
                Pesquisar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
              availableYears={AVAILABLE_YEARS}
              availableThemes={AVAILABLE_THEMES}
            />
          </aside>

          <div className="lg:col-span-3">
            {isLoading ? (
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
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
