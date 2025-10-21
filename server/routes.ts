import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchRequestSchema, type SearchResponse, type DriveFile, type ProcessingStatus, documentMetadataSchema } from "@shared/schema";
import OpenAI from "openai";
import { getUncachableGoogleDriveClient } from "./google-drive";
import { Readable } from "stream";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

let VECTOR_STORE_ID: string | undefined;

export async function registerRoutes(app: Express): Promise<Server> {
  // Load vector store ID from database on startup
  const existingVectorStore = await storage.getVectorStore();
  if (existingVectorStore) {
    VECTOR_STORE_ID = existingVectorStore.id;
    console.log("Loaded vector store from database:", VECTOR_STORE_ID);
  }
  // List PDFs from Google Drive with processing status
  app.get("/api/drive/pdfs", async (req, res) => {
    try {
      const drive = await getUncachableGoogleDriveClient();
      
      const response = await drive.files.list({
        q: "mimeType='application/pdf' and trashed=false",
        pageSize: 100,
        fields: "files(id,name,mimeType,modifiedTime)",
      });

      // Get all processed documents from database
      const processedDocs = await storage.getAllDocuments();
      const processedMap = new Map(processedDocs.map(doc => [doc.driveFileId, doc]));

      const files = response.data.files?.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        modifiedTime: file.modifiedTime || undefined,
        processed: processedMap.has(file.id!),
        metadata: processedMap.get(file.id!)?.metadata,
      })) || [];

      res.json({ files });
    } catch (error: any) {
      console.error("Drive list error:", error);
      res.status(500).json({ error: "Failed to list Drive files", message: error.message });
    }
  });

  // Create or get vector store
  app.post("/api/vector-store/init", async (req, res) => {
    try {
      if (!VECTOR_STORE_ID) {
        const vectorStore = await client.beta.vectorStores.create({
          name: "meus-artigos-medicos",
        });
        VECTOR_STORE_ID = vectorStore.id;
        
        // Persist to database
        await storage.createVectorStore({ id: VECTOR_STORE_ID });
        console.log("Created new vector store and saved to database:", VECTOR_STORE_ID);
      }

      res.json({ vectorStoreId: VECTOR_STORE_ID });
    } catch (error: any) {
      console.error("Vector store init error:", error);
      res.status(500).json({ error: "Failed to initialize vector store", message: error.message });
    }
  });

  // Process a single PDF from Drive
  app.post("/api/drive/process/:fileId", async (req, res) => {
    const { fileId } = req.params;
    
    try {
      const drive = await getUncachableGoogleDriveClient();
      
      // Step 1: Get file metadata
      const fileMetadata = await drive.files.get({
        fileId,
        fields: "id,name",
      });

      const fileName = fileMetadata.data.name || "unknown.pdf";
      
      // Step 2: Download file content
      const fileContent = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" }
      );

      // Step 3: Ensure vector store exists
      if (!VECTOR_STORE_ID) {
        const vectorStore = await client.beta.vectorStores.create({
          name: "meus-artigos-medicos",
        });
        VECTOR_STORE_ID = vectorStore.id;
        await storage.createVectorStore({ id: VECTOR_STORE_ID });
      }

      // Step 4: Upload to vector store
      const buffer = Buffer.from(fileContent.data as ArrayBuffer);
      const file = await client.files.create({
        file: new File([buffer], fileName, { type: "application/pdf" }),
        purpose: "assistants",
      });

      await client.beta.vectorStores.files.create(VECTOR_STORE_ID, {
        file_id: file.id,
      });

      // Step 5: Generate fichamento with structured outputs
      const assistant = await client.beta.assistants.create({
        model: "gpt-4o",
        instructions: "Você é um especialista em análise de artigos científicos. Extraia as informações conforme o schema JSON fornecido.",
        tools: [{ type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_store_ids: [VECTOR_STORE_ID],
          },
        },
      });

      const thread = await client.beta.threads.create({
        messages: [{
          role: "user",
          content: `Analise o documento "${fileName}" e gere um fichamento completo seguindo o schema JSON. Extraia: identificação (DOI, título, ano, autores, periódico, tipo de estudo, área/tema), métodos (população, intervenções, comparadores, desfechos, duração, n), resultados (efeito principal, medidas de efeito, estatísticas), segurança (eventos adversos, limitações, risco de viés), conclusão clínica e resumo executivo.`,
        }],
      });

      const run = await client.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "fichamento_schema",
            strict: true,
            schema: {
              type: "object",
              properties: {
                identificacao: {
                  type: "object",
                  properties: {
                    doi: { type: "string" },
                    titulo: { type: "string" },
                    ano: { type: "number" },
                    autores: { type: "array", items: { type: "string" } },
                    periodico: { type: "string" },
                    tipo_estudo: { type: "string" },
                    area_tema: { type: "array", items: { type: "string" } },
                  },
                  required: ["titulo", "ano"],
                  additionalProperties: false,
                },
                metodos: {
                  type: "object",
                  properties: {
                    populacao: { type: "string" },
                    intervencoes: { type: "string" },
                    comparadores: { type: "string" },
                    desfechos: { type: "string" },
                    duracao: { type: "string" },
                    n: { type: "number" },
                  },
                  additionalProperties: false,
                },
                resultados: {
                  type: "object",
                  properties: {
                    efeito_principal: { type: "string" },
                    medidas_efeito: { type: "array", items: { type: "string" } },
                    estatisticas: { type: "array", items: { type: "string" } },
                  },
                  additionalProperties: false,
                },
                seguranca: {
                  type: "object",
                  properties: {
                    eventos_adversos: { type: "string" },
                    limitacoes: { type: "string" },
                    risco_sesgo: { type: "string" },
                  },
                  additionalProperties: false,
                },
                conclusao_clinica: { type: "string" },
                resumo_teleprompter: { type: "string" },
                referencias: { type: "array", items: { type: "string" } },
              },
              required: ["identificacao", "conclusao_clinica", "resumo_teleprompter"],
              additionalProperties: false,
            },
          },
        },
      });

      const messages = await client.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find((m: any) => m.role === "assistant");
      const textContent = assistantMessage?.content.find((c: any) => c.type === "text");
      
      let metadata: any = {};
      if (textContent && textContent.type === "text") {
        metadata = JSON.parse(textContent.text.value);
      }

      // Step 6: Generate new filename
      const ano = metadata.identificacao?.ano || "";
      const autor = metadata.identificacao?.autores?.[0]?.split(",")[0] || "Autor";
      const titulo = metadata.identificacao?.titulo?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, "_") || "Titulo";
      const tema = metadata.identificacao?.area_tema?.[0]?.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_") || "Tema";
      const newFileName = `${ano}_${autor}_${titulo}_${tema}.pdf`;

      // Step 7: Rename file in Drive
      await drive.files.update({
        fileId,
        requestBody: {
          name: newFileName,
        },
      });

      // Step 8: Save metadata to database
      const existingDoc = await storage.getDocument(fileId);
      if (existingDoc) {
        await storage.updateDocument(fileId, {
          renamedFileName: newFileName,
          vectorStoreFileId: file.id,
          metadata: metadata,
        });
      } else {
        await storage.createDocument({
          driveFileId: fileId,
          originalFileName: fileName,
          renamedFileName: newFileName,
          vectorStoreFileId: file.id,
          metadata: metadata,
        });
      }

      // Cleanup
      await client.beta.assistants.del(assistant.id);
      await client.beta.threads.del(thread.id);

      res.json({
        success: true,
        fileId,
        metadata,
        newFileName,
      });
    } catch (error: any) {
      console.error("Process PDF error:", error);
      res.status(500).json({ error: "Failed to process PDF", message: error.message });
    }
  });

  // Search using vector store
  app.post("/api/search", async (req, res) => {
    try {
      if (!VECTOR_STORE_ID) {
        return res.status(500).json({ 
          error: "Vector store not initialized. Please process some PDFs first." 
        });
      }

      const validationResult = searchRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: validationResult.error.errors 
        });
      }

      const { q, filtros } = validationResult.data;

      let systemPrompt = "Você é um assistente de pesquisa especializado em documentos científicos e médicos. Responda objetivamente em bullets, destacando os trechos mais relevantes dos documentos indexados.";
      
      if (filtros?.ano || filtros?.tema || filtros?.tipo_estudo) {
        systemPrompt += "\n\nFiltros solicitados:";
        if (filtros.ano) systemPrompt += `\n- Ano: ${filtros.ano}`;
        if (filtros.tema) systemPrompt += `\n- Tema: ${filtros.tema}`;
        if (filtros.tipo_estudo) systemPrompt += `\n- Tipo de estudo: ${filtros.tipo_estudo}`;
      }

      const assistant = await client.beta.assistants.create({
        model: "gpt-4o",
        instructions: systemPrompt,
        tools: [{ type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_store_ids: [VECTOR_STORE_ID],
          },
        },
      });

      const thread = await client.beta.threads.create({
        messages: [{
          role: "user",
          content: q,
        }],
      });

      const run = await client.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
      });

      const messages = await client.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find((m: any) => m.role === "assistant");
      const textContent = assistantMessage?.content.find((c: any) => c.type === "text");
      
      const content = textContent && textContent.type === "text" ? textContent.text.value : "Nenhum resultado encontrado.";

      // Get all processed documents with metadata
      const allDocs = await storage.getAllDocuments();
      const sources = allDocs
        .filter(doc => doc.metadata)
        .map(doc => ({
          metadata: doc.metadata,
          excerpt: `${doc.renamedFileName || doc.originalFileName}`,
        }));

      await client.beta.assistants.del(assistant.id);
      await client.beta.threads.del(thread.id);

      const searchResponse: SearchResponse = {
        content,
        sources,
      };

      res.json(searchResponse);
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({ 
        error: "Search failed", 
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
