import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DriveFile } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function PdfManager() {
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: filesData, isLoading: isLoadingFiles, refetch } = useQuery({
    queryKey: ["/api/drive/pdfs"],
    queryFn: async () => {
      const response = await fetch("/api/drive/pdfs");
      if (!response.ok) throw new Error("Failed to load files");
      return response.json();
    },
  });

  const initVectorStoreMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/vector-store/init", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to initialize vector store");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Vector Store Pronto",
        description: `ID: ${data.vectorStoreId}`,
      });
    },
  });

  const processFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/drive/process/${fileId}`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process file");
      }
      return response.json();
    },
    onSuccess: (data, fileId) => {
      setProcessingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      toast({
        title: "Fichamento Gerado!",
        description: `Arquivo renomeado para: ${data.newFileName}`,
      });
      refetch();
    },
    onError: (error: any, fileId) => {
      setProcessingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      toast({
        title: "Erro no Processamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProcessFile = (fileId: string) => {
    setProcessingFiles(prev => new Set(prev).add(fileId));
    processFileMutation.mutate(fileId);
  };

  const handleProcessAll = async () => {
    const files = filesData?.files || [];
    for (const file of files) {
      if (!processingFiles.has(file.id)) {
        handleProcessFile(file.id);
        // Add small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const files: DriveFile[] = filesData?.files || [];

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
                <h1 className="text-xl font-semibold">PDF Manager</h1>
                <p className="text-xs text-muted-foreground">Google Drive Integration</p>
              </div>
            </div>
            <Navigation />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">PDFs do Google Drive</h2>
            <p className="text-muted-foreground">
              {files.length} arquivo{files.length !== 1 ? "s" : ""} encontrado{files.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => initVectorStoreMutation.mutate()}
              variant="outline"
              disabled={initVectorStoreMutation.isPending}
              data-testid="button-init-vector-store"
            >
              {initVectorStoreMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inicializar Vector Store
            </Button>
            <Button
              onClick={handleProcessAll}
              disabled={files.length === 0 || processingFiles.size > 0}
              data-testid="button-process-all"
            >
              <Upload className="mr-2 h-4 w-4" />
              Processar Todos
            </Button>
          </div>
        </div>

        {isLoadingFiles ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : files.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum PDF Encontrado</h3>
            <p className="text-muted-foreground">
              Adicione arquivos PDF ao seu Google Drive para começar.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => {
              const isProcessing = processingFiles.has(file.id);
              return (
                <Card key={file.id} className="p-6" data-testid={`file-card-${file.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate" data-testid={`file-name-${file.id}`}>
                            {file.name}
                          </h3>
                          {file.processed && (
                            <Badge variant="default" className="gap-1 flex-shrink-0">
                              <CheckCircle2 className="h-3 w-3" />
                              Processado
                            </Badge>
                          )}
                        </div>
                        {file.modifiedTime && (
                          <p className="text-sm text-muted-foreground">
                            Modificado: {new Date(file.modifiedTime).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                        {file.processed && file.metadata?.identificacao && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p className="line-clamp-1">
                              {file.metadata.identificacao.titulo} ({file.metadata.identificacao.ano})
                            </p>
                            {file.metadata.identificacao.autores && file.metadata.identificacao.autores.length > 0 && (
                              <p className="line-clamp-1">
                                {file.metadata.identificacao.autores.slice(0, 3).join(", ")}
                                {file.metadata.identificacao.autores.length > 3 && " et al."}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isProcessing ? (
                        <Badge variant="secondary" className="gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processando...
                        </Badge>
                      ) : file.processed ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Completo
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleProcessFile(file.id)}
                          size="sm"
                          data-testid={`button-process-${file.id}`}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Processar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Como Funciona:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>PDFs são listados do seu Google Drive</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Ao processar, o arquivo é baixado e enviado para o Vector Store</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>IA gera fichamento estruturado com metadados completos</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Arquivo é renomeado no Drive: Ano_Autor_Titulo_Tema.pdf</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">5.</span>
              <span>Documentos ficam disponíveis para busca na página de pesquisa</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
