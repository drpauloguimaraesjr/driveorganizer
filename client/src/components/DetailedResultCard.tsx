import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Beaker, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface DetailedSearchResult {
  id: string;
  titulo: string;
  ano: number;
  autores?: string[];
  periodico?: string;
  tipo_estudo?: string;
  area_tema?: string[];
  doi?: string;
  metodos?: {
    populacao?: string;
    intervencoes?: string;
    comparadores?: string;
    desfechos?: string;
    duracao?: string;
    n?: number;
  };
  resultados?: {
    efeito_principal?: string;
    medidas_efeito?: string[];
    estatisticas?: string[];
  };
  seguranca?: {
    eventos_adversos?: string;
    limitacoes?: string;
    risco_sesgo?: string;
  };
  conclusao_clinica: string;
  resumo_teleprompter?: string;
  referencias?: string[];
  excerpt?: string;
}

interface DetailedResultCardProps {
  result: DetailedSearchResult;
}

export function DetailedResultCard({ result }: DetailedResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6 hover-elevate transition-all duration-200" data-testid={`result-card-${result.id}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2" data-testid={`result-title-${result.id}`}>
            {result.titulo}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs" data-testid={`result-year-${result.id}`}>
              {result.ano}
            </Badge>
            {result.tipo_estudo && (
              <Badge variant="outline" className="text-xs">
                {result.tipo_estudo}
              </Badge>
            )}
            {result.area_tema?.map((tema, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tema}
              </Badge>
            ))}
          </div>

          {result.autores && result.autores.length > 0 && (
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">Autores:</span> {result.autores.slice(0, 3).join(", ")}
              {result.autores.length > 3 && ` e ${result.autores.length - 3} mais`}
            </p>
          )}

          {result.periodico && (
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">Periódico:</span> {result.periodico}
            </p>
          )}

          <div className="mb-4 p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium mb-2">Conclusão Clínica</p>
            <p className="text-sm text-foreground/90">{result.conclusao_clinica}</p>
          </div>

          {result.excerpt && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Trecho Relevante</p>
              <p className="text-sm text-muted-foreground italic">"{result.excerpt}"</p>
            </div>
          )}

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                data-testid={`button-expand-${result.id}`}
              >
                {isExpanded ? "Ver Menos" : "Ver Mais Detalhes"}
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 space-y-4">
              {result.metodos && (
                <div className="border-l-2 border-primary/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Métodos</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {result.metodos.populacao && (
                      <p><span className="font-medium">População:</span> {result.metodos.populacao}</p>
                    )}
                    {result.metodos.n && (
                      <p><span className="font-medium">Amostra:</span> n = {result.metodos.n}</p>
                    )}
                    {result.metodos.intervencoes && (
                      <p><span className="font-medium">Intervenções:</span> {result.metodos.intervencoes}</p>
                    )}
                    {result.metodos.comparadores && (
                      <p><span className="font-medium">Comparadores:</span> {result.metodos.comparadores}</p>
                    )}
                    {result.metodos.desfechos && (
                      <p><span className="font-medium">Desfechos:</span> {result.metodos.desfechos}</p>
                    )}
                    {result.metodos.duracao && (
                      <p><span className="font-medium">Duração:</span> {result.metodos.duracao}</p>
                    )}
                  </div>
                </div>
              )}

              {result.resultados && (
                <div className="border-l-2 border-chart-2/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker className="h-4 w-4 text-chart-2" />
                    <p className="text-sm font-semibold">Resultados</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {result.resultados.efeito_principal && (
                      <p><span className="font-medium">Efeito Principal:</span> {result.resultados.efeito_principal}</p>
                    )}
                    {result.resultados.medidas_efeito && result.resultados.medidas_efeito.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Medidas de Efeito:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {result.resultados.medidas_efeito.map((medida, idx) => (
                            <li key={idx}>{medida}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.resultados.estatisticas && result.resultados.estatisticas.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Estatísticas:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {result.resultados.estatisticas.map((stat, idx) => (
                            <li key={idx}>{stat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.seguranca && (
                <div className="border-l-2 border-destructive/30 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm font-semibold">Segurança e Limitações</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {result.seguranca.eventos_adversos && (
                      <p><span className="font-medium">Eventos Adversos:</span> {result.seguranca.eventos_adversos}</p>
                    )}
                    {result.seguranca.limitacoes && (
                      <p><span className="font-medium">Limitações:</span> {result.seguranca.limitacoes}</p>
                    )}
                    {result.seguranca.risco_sesgo && (
                      <p><span className="font-medium">Risco de Viés:</span> {result.seguranca.risco_sesgo}</p>
                    )}
                  </div>
                </div>
              )}

              {result.resumo_teleprompter && (
                <div className="p-4 bg-accent/50 rounded-md">
                  <p className="text-sm font-medium mb-2">Resumo Executivo</p>
                  <p className="text-sm">{result.resumo_teleprompter}</p>
                </div>
              )}

              {result.doi && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">DOI:</span>
                  <a 
                    href={`https://doi.org/${result.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {result.doi}
                  </a>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
}
