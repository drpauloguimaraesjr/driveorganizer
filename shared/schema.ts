import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const studyTypeEnum = [
  "RCT",
  "Cohort",
  "Case-control",
  "Cross-sectional",
  "Systematic Review",
  "Meta-analysis",
  "Case series",
  "Other"
] as const;

export const documentIdentificationSchema = z.object({
  doi: z.string().optional(),
  titulo: z.string(),
  ano: z.number(),
  autores: z.array(z.string()).optional(),
  periodico: z.string().optional(),
  tipo_estudo: z.enum(studyTypeEnum).optional(),
  area_tema: z.array(z.string()).optional(),
});

export const documentMethodsSchema = z.object({
  populacao: z.string().optional(),
  intervencoes: z.string().optional(),
  comparadores: z.string().optional(),
  desfechos: z.string().optional(),
  duracao: z.string().optional(),
  n: z.number().optional(),
});

export const documentResultsSchema = z.object({
  efeito_principal: z.string().optional(),
  medidas_efeito: z.array(z.string()).optional(),
  estatisticas: z.array(z.string()).optional(),
});

export const documentSafetySchema = z.object({
  eventos_adversos: z.string().optional(),
  limitacoes: z.string().optional(),
  risco_sesgo: z.string().optional(),
});

export const documentMetadataSchema = z.object({
  identificacao: documentIdentificationSchema,
  metodos: documentMethodsSchema.optional(),
  resultados: documentResultsSchema.optional(),
  seguranca: documentSafetySchema.optional(),
  conclusao_clinica: z.string(),
  resumo_teleprompter: z.string(),
  referencias: z.array(z.string()).optional(),
});

export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;
export type DocumentIdentification = z.infer<typeof documentIdentificationSchema>;
export type StudyType = typeof studyTypeEnum[number];

export const searchRequestSchema = z.object({
  q: z.string().min(1, "Query is required"),
  filtros: z.object({
    ano: z.string().optional(),
    tema: z.string().optional(),
    tipo_estudo: z.string().optional(),
  }).optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;

export interface SearchResponse {
  content: string;
  sources?: Array<{
    metadata?: DocumentMetadata;
    excerpt?: string;
  }>;
}
