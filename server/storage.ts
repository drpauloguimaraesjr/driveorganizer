import { 
  type User, 
  type InsertUser,
  type VectorStore,
  type InsertVectorStore,
  type Document,
  type InsertDocument,
  users,
  vectorStores,
  documents
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVectorStore(): Promise<VectorStore | undefined>;
  createVectorStore(vectorStore: InsertVectorStore): Promise<VectorStore>;
  
  getDocument(driveFileId: string): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(driveFileId: string, updates: Partial<InsertDocument>): Promise<Document>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getVectorStore(): Promise<VectorStore | undefined> {
    const [vectorStore] = await db.select().from(vectorStores).limit(1);
    return vectorStore || undefined;
  }

  async createVectorStore(insertVectorStore: InsertVectorStore): Promise<VectorStore> {
    const [vectorStore] = await db.insert(vectorStores).values(insertVectorStore).returning();
    return vectorStore;
  }

  async getDocument(driveFileId: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.driveFileId, driveFileId));
    return document || undefined;
  }

  async getAllDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(insertDocument as any).returning();
    return document;
  }

  async updateDocument(driveFileId: string, updates: Partial<InsertDocument>): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set(updates as any)
      .where(eq(documents.driveFileId, driveFileId))
      .returning();
    return document;
  }
}

export const storage = new DatabaseStorage();
