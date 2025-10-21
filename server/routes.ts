import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchRequestSchema, type SearchResponse } from "@shared/schema";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID;

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/search", async (req, res) => {
    try {
      if (!VECTOR_STORE_ID) {
        return res.status(500).json({ 
          error: "VECTOR_STORE_ID not configured. Please set this environment variable." 
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

      let systemPrompt = "Você é um assistente de pesquisa especializado em documentos científicos e médicos. Responda objetivamente em bullets, destacando os trechos mais relevantes.";
      
      if (filtros?.ano || filtros?.tema || filtros?.tipo_estudo) {
        systemPrompt += "\n\nFiltros aplicados:";
        if (filtros.ano) systemPrompt += `\n- Ano: ${filtros.ano}`;
        if (filtros.tema) systemPrompt += `\n- Tema: ${filtros.tema}`;
        if (filtros.tipo_estudo) systemPrompt += `\n- Tipo de estudo: ${filtros.tipo_estudo}`;
      }

      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: q
        }
      ];

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages,
      });

      const responseMessage = response.choices[0]?.message;
      const content = responseMessage?.content || "Nenhum resultado encontrado.";

      const searchResponse: SearchResponse = {
        content,
        sources: [],
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
