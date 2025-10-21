# Document Search and Management Application

## Overview
A full-stack web application that integrates Google Drive with OpenAI's vector stores to provide intelligent document search and metadata extraction for PDF files. The system automatically processes PDFs, generates structured metadata (fichamento), and renames files in a standardized format.

## Project Purpose
Enable researchers and medical professionals to:
- List and manage PDF files from Google Drive
- Automatically extract structured metadata from research papers
- Search documents using natural language queries powered by AI
- Organize files with standardized naming convention: `Ano_Autor_Titulo_Tema.pdf`

## Current State
**Status**: Fully functional prototype with Google Drive integration and OpenAI vector stores
**Last Updated**: October 21, 2025

### What's Working:
- ✅ Google Drive OAuth connection and PDF listing
- ✅ PDF download from Drive
- ✅ Vector store creation and file uploads
- ✅ Structured metadata extraction using GPT-4 with structured outputs
- ✅ Automatic file renaming in Google Drive
- ✅ AI-powered document search interface
- ✅ Dark mode support with modern UI

## Recent Changes (October 21, 2025)

### Migration from Next.js to Fullstack JavaScript
- Migrated from Next.js to Express + React + Vite for better Replit deployment compatibility
- Implemented full backend API with Express routes
- Created React frontend with Wouter for routing

### Google Drive Integration
- Added Google Drive connector via Replit Integrations
- Implemented OAuth flow for secure access
- Built PDF listing and downloading functionality

### OpenAI Vector Store Integration
- Connected to OpenAI using Replit AI Integrations (no API key needed)
- Implemented vector store creation and management
- Added file upload to vector stores with automatic chunking

### Structured Metadata Extraction (Fichamento)
- Implemented GPT-4 structured outputs for metadata extraction
- Created comprehensive JSON schema for medical/research papers
- Fields include: identificacao, metodos, resultados, seguranca, conclusao_clinica, resumo_teleprompter

### File Renaming System
- Automatic renaming based on extracted metadata
- Format: `{ano}_{primeiro_autor}_{titulo_curto}_{tema_principal}.pdf`
- Updates files directly in Google Drive

### Frontend Components
- **PdfManager**: List Drive PDFs, trigger processing, monitor progress
- **Search**: AI-powered document search with filters
- **Navigation**: Seamless navigation between pages
- Dark mode toggle with persistent theme

## Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Wouter (routing)
- **Backend**: Express.js + TypeScript
- **Database**: In-memory storage (MemStorage)
- **External APIs**: Google Drive API, OpenAI API
- **UI**: Shadcn UI + Tailwind CSS + Radix UI primitives
- **State Management**: TanStack Query (React Query v5)

### Project Structure
```
├── client/src/
│   ├── pages/
│   │   ├── PdfManager.tsx    # Google Drive PDF management
│   │   └── Search.tsx         # AI-powered document search
│   ├── components/
│   │   ├── Navigation.tsx     # App navigation
│   │   ├── SearchBar.tsx
│   │   ├── EnhancedFilterPanel.tsx
│   │   ├── DetailedResultCard.tsx
│   │   └── ui/                # Shadcn components
│   └── App.tsx
├── server/
│   ├── routes.ts              # API endpoints
│   ├── google-drive.ts        # Google Drive integration
│   ├── storage.ts             # In-memory storage interface
│   └── index.ts               # Express server
└── shared/
    └── schema.ts              # Shared types and schemas
```

### API Endpoints

#### Google Drive
- `GET /api/drive/pdfs` - List PDF files from Google Drive
- `POST /api/drive/process/:fileId` - Process a PDF (download → upload to vector store → extract metadata → rename)

#### Vector Store
- `POST /api/vector-store/init` - Initialize vector store
- `POST /api/vector-store/search` - Search documents with natural language

#### Workflow
1. User clicks "Processar" on a PDF
2. Backend downloads PDF from Google Drive
3. File is uploaded to OpenAI vector store
4. GPT-4 Assistant extracts structured metadata
5. File is renamed in Drive based on metadata
6. Document becomes searchable via Search page

## User Preferences

### Design Preferences
- **Theme**: Dark mode as primary (with light mode support)
- **Typography**: Inter for body text, JetBrains Mono for code/technical content
- **Style**: Material Design/Linear aesthetic - clean, modern, minimal
- **Colors**: Dark backgrounds with subtle borders, primary accent colors

### Development Preferences
- Follow Fullstack JavaScript development guidelines
- Use in-memory storage (MemStorage) unless database explicitly requested
- Minimize file count - collapse similar components
- Use Shadcn UI components consistently
- Implement data-testid attributes for testing

## Environment Variables
The application uses Replit AI Integrations for secure secret management:

### Available Secrets
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Auto-managed by Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - Auto-managed by Replit AI Integrations
- `SESSION_SECRET` - Express session encryption

### Google Drive OAuth
- Managed via Replit Google Drive connector
- OAuth flow handled automatically
- Scopes: `drive.readonly`, `drive.file`

## Key Features

### PDF Processing Workflow
1. **List PDFs**: Displays all PDF files from Google Drive
2. **Process Individual/All**: Trigger processing for one or all files
3. **Download**: Fetch PDF content from Drive
4. **Upload to Vector Store**: Add to OpenAI vector store for semantic search
5. **Extract Metadata**: Use GPT-4 Assistant with structured outputs to extract:
   - DOI, título, ano, autores
   - Tipo de estudo, área/tema
   - Métodos, resultados
   - Segurança (eventos adversos)
   - Conclusão clínica
   - Resumo para teleprompter
6. **Rename File**: Update Drive file to `Ano_Autor_Titulo_Tema.pdf`

### Document Search
- Natural language queries
- Filter by year, study type, subject area
- AI-powered search using vector store
- Displays structured metadata in results

### Metadata Schema (Fichamento)
```typescript
{
  identificacao: {
    doi: string
    titulo: string
    ano: number
    autores: string[]
    tipo_estudo: "RCT" | "Meta-análise" | "Revisão Sistemática" | ...
    area_tema: "Cardiologia" | "Diabetes" | "Obesidade" | ...
  }
  metodos: {
    desenho: string
    populacao: string
    intervencao: string
    comparador: string
    desfechos_primarios: string[]
    duracao: string
  }
  resultados: {
    desfecho_primario: string
    desfechos_secundarios: string[]
    analise_subgrupos?: string
  }
  seguranca: {
    eventos_adversos: string
    descontinuacao: string
  }
  conclusao_clinica: {
    mensagem_principal: string
    implicacoes_pratica: string
    limitacoes: string[]
  }
  resumo_teleprompter: string
}
```

## Integrations

### Google Drive (via Replit Connector)
- **Connection ID**: `connector:google-drive`
- **OAuth**: Automatic flow managed by Replit
- **Scopes**: Read-only + file management
- **Purpose**: List PDFs, download content, rename files

### OpenAI (via Replit AI Integrations)
- **Connection**: Automatic via Replit credits
- **Models Used**: 
  - GPT-4 with structured outputs for metadata extraction
  - text-embedding-ada-002 for vector store embeddings
- **Features**: Assistants API, Vector Stores, file_search tool
- **Billing**: Charged to Replit credits (no separate API key needed)

## Design Guidelines
See `design_guidelines.md` for detailed design system documentation.

### Key Design Principles
- Dark mode primary with light mode support
- Minimal, clean interface inspired by Linear
- Consistent spacing and typography
- Hover interactions with subtle elevation
- Semantic color tokens from Shadcn

## Known Limitations
- In-memory storage (data lost on server restart)
- Rate limiting considerations for batch processing
- Large PDFs may take longer to process
- Vector store search limited by OpenAI token limits

## Future Enhancements
- Persistent database for metadata storage
- Batch processing with progress tracking
- Citation export (BibTeX, RIS)
- Advanced filters (author, journal)
- PDF preview/viewer integration
- User authentication and multi-tenancy

## Development Notes

### Testing Strategy
- Use `run_test` tool for E2E testing with Playwright
- Test browser interactions, forms, API workflows
- Generate unique test data to avoid conflicts

### Common Issues
- **OpenAI Package**: Must be explicitly installed (`openai` npm package)
- **OAuth Flow**: Requires user to complete Google Drive authorization
- **Vector Store Init**: Must call `/api/vector-store/init` before processing files
- **File Renaming**: Uses Google Drive API - requires appropriate permissions

### Deployment
- Runs on Replit with automatic deployment
- Port 5000 for frontend (Vite dev server)
- Backend and frontend served from same Express instance
- No separate build step needed for development
