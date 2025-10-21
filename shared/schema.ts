import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
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

export const vectorStores = pgTable("vector_stores", {
  id: varchar("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVectorStoreSchema = createInsertSchema(vectorStores).pick({
  id: true,
});

export type InsertVectorStore = z.infer<typeof insertVectorStoreSchema>;
export type VectorStore = typeof vectorStores.$inferSelect;

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driveFileId: text("drive_file_id").notNull().unique(),
  originalFileName: text("original_file_name").notNull(),
  renamedFileName: text("renamed_file_name"),
  vectorStoreFileId: text("vector_store_file_id"),
  metadata: jsonb("metadata"),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  processedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

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

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  processed?: boolean;
  metadata?: any;
}

export interface ProcessingStatus {
  fileId: string;
  fileName: string;
  status: 'pending' | 'downloading' | 'uploading' | 'generating_metadata' | 'renaming' | 'completed' | 'error';
  error?: string;
  metadata?: DocumentMetadata;
  newFileName?: string;
}
