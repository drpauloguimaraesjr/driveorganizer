import { Search, FileSearch } from "lucide-react";

interface EmptyStateProps {
  variant?: "initial" | "no-results";
  query?: string;
}

export function EmptyState({ variant = "initial", query }: EmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state-no-results">
        <div className="p-4 rounded-full bg-muted mb-4">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
        <p className="text-muted-foreground max-w-md">
          Não encontramos documentos correspondentes à sua busca{query ? ` "${query}"` : ""}.
          Tente ajustar os filtros ou usar termos diferentes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state-initial">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Search className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Comece sua pesquisa</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        Digite uma pergunta ou termo de pesquisa para encontrar informações relevantes nos documentos.
      </p>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Dicas:</p>
        <ul className="list-disc list-inside text-left inline-block">
          <li>Use perguntas específicas para melhores resultados</li>
          <li>Aplique filtros de ano ou tema para refinar</li>
          <li>Experimente diferentes termos relacionados</li>
        </ul>
      </div>
    </div>
  );
}
