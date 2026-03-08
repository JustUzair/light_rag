<div align="center">

```
           █████╗ ██╗  ██╗██╗ ██████╗ ███╗   ███╗
         ██╔══██╗╚██╗██╔╝██║██╔═══██╗████╗ ████║
         ███████║ ╚███╔╝ ██║██║   ██║██╔████╔██║
         ██╔══██║ ██╔██╗ ██║██║   ██║██║╚██╔╝██║
         ██║  ██║██╔╝ ██╗██║╚██████╔╝██║ ╚═╝ ██║
         ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝
```

**Intelligent Dual-Mode RAG Engine**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C?style=flat-square&logo=chainlink&logoColor=white)](https://js.langchain.com/)
[![LightRAG](https://img.shields.io/badge/LightRAG-Embeddings-06b6d4?style=flat-square)](https://github.com/HKUDS/LightRAG)
[![Zod](https://img.shields.io/badge/Zod-4.x-3E67B1?style=flat-square)](https://zod.dev/)
[![Tavily](https://img.shields.io/badge/Tavily-Web_Search-FF6B35?style=flat-square)](https://tavily.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Spline](https://img.shields.io/badge/Spline-3D_Scene-black?style=flat-square)](https://spline.design/)
[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](LICENSE)

<br/>

**[Live Demo →](https://axiom-ai-justuzair.vercel.app)** · **[Backend API →](https://axiom-lcel-backend-justuzair.vercel.app)** · **[API Docs →](https://documenter.getpostman.com/view/20867739/2sBXcLgHZF)**

</div>

---

## What is AXIOM?

AXIOM is a dual-mode AI intelligence engine that intelligently routes queries between two execution paths: **web-based retrieval** for real-time information and **private knowledge base** for internal corpus questions. The system automatically decides which mode to use based on query analysis: no manual switching required.

### Two Execution Modules

**Module 01: Web Search** is a Retrieval-Augmented Generation pipeline built with LangChain Expression Language (LCEL). It uses Tavily API for real-time web retrieval, scrapes and summarizes web pages, then synthesizes fully cited answers. For queries that are static or don't require web retrieval, it uses the LLM directly.

**Module 02: Knowledge Base** is a private RAG system powered by LightRAG embeddings. Users can ingest documents which are chunked (1000 chars with 200 char overlap) and embedded into an in-memory vector store. Queries are answered strictly from that corpus with confidence scoring and source attribution.

### Frontend Experience

The client is a Next.js application featuring a dark void aesthetic with Spline 3D hero scene, Syne typography, Framer Motion animations, 3D tilt cards, per-word answer reveals, interactive mouse spotlight, and responsive design for all devices.

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                  Next.js App (Vercel)                           │
│      POST /api/search  ─────  POST /api/kb/ingest               │
│      Next.js API Route (proxy, keeps secrets server-side)       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND                             │
│                   (Vercel Serverless)                           │
│                                                                 │
│   Rate Limiter (10 req / 10 min)  ──→  CORS  ──→  Controller    │
└──────────────────┬────────────────────────┬─────────────────────┘
                   │                        │
                   ▼                        ▼
     ┌─────────────────────┐   ┌────────────────────────┐
     │   /api/v1/search    │   │    /api/v1/kb/*        │
     │   LCEL Pipeline     │   │    LightRAG KB         │
     └──────────┬──────────┘   └───────────┬────────────┘
                │                          │
                ▼                          ▼
     ┌──────────────────┐      ┌───────────────────────┐
     │ Route Strategy   │      │ POST /kb/ingest       │
     │ Pattern Detect   │      │ Chunk → Embed → Store │
     └─────┬────────┬───┘      ├───────────────────────┤
           │        │          │ POST /kb/ask          │
     ┌──────┐  ┌──────┐        │ Search → Synthesize   │
     │ WEB  │  │DIRECT│        └───────────────────────┘
     │PIPE  │  │PIPE  │
     └──┬───┘  └──┬───┘
        │         │
        │         ├─→ LLM (Gemini/OpenAI/Groq/Deepseek)
        │         │
        └─────┬───┘
              │
       ┌──────▼──────────┐
       │  { answer,      │
       │    sources[],   │
       │    confidence,  │
       │    mode }       │
       └─────────────────┘
```

### Web Search: Query Routing Logic

Before invoking any LLM, the router analyzes the query using pattern matching:

**Routes to WEB mode if query contains:**

- Time-sensitive keywords: "latest", "today", "now", "current", "news", "trending"
- Recent years: 2024, 2025, 2026+
- Comparison intent: "top 10", "best", "ranking", "vs", "compare"
- Pricing/financial: "price", "cost", "cheaper", "under $X"
- Social proof: "review", "rating", "tutorial", "how to"
- URLs in the query
- Technical status: "deprecated", "eol", "changelog", "release notes"
- Compatibility queries: "works with", "compatible with", "install"
- Community searches: "reddit", "forum", "twitter"

**Routes to DIRECT mode:**

- All other queries (answered directly from the LLM)

Routing is deterministic and fast: no LLM calls required for the routing decision.

### Web Pipeline: Step by Step

```
Query
  │
  ▼
┌─────────────────────────────────────────┐
│  STEP 1 · Tavily Web Search             │
│  Searches the web, returns top 5        │
│  results with title, URL, snippet       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 2 · Fetch & Extract               │
│  Visits each URL, scrapes HTML,         │
│  extracts text via html-to-text         │
│  Falls back to Tavily snippet if page   │
│  fails to load                          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 3 · Summarize                     │
│  Each page's text is individually       │
│  summarized by the LLM into 5-8         │
│  sentences for clarity                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 4 · Synthesize                    │
│  All summaries are passed to the LLM    │
│  with the original query to create      │
│  one coherent, fully-cited answer       │
└─────────────────────────────────────────┘
```

### Knowledge Base Pipeline: Step by Step

**Ingestion:**

```
Document Text
  │
  ▼
┌─────────────────────────────────────────┐
│  STEP 1 · Chunk                         │
│  Split into overlapping chunks (1000    │
│  chars with 200 char overlap)           │
│  Each chunk labeled with source         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 2 · Embed                         │
│  Each chunk embedded via LightRAG       │
│  embedding model into vector space      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 3 · Store                         │
│  Vectors persisted in in-memory store   │
│  keyed by source + chunkId              │
└─────────────────────────────────────────┘
```

**Retrieval & Answering:**

```
Query
  │
  ▼
┌─────────────────────────────────────────┐
│  STEP 1 · Embed Query                   │
│  Query embedded using same model        │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 2 · Vector Search                 │
│  Cosine similarity, retrieve top-K      │
│  chunks matching the query              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  STEP 3 · Synthesize                    │
│  LLM generates answer from chunks,      │
│  includes confidence score and          │
│  source attribution                     │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
axiom/
├── agent/                              # Express Backend
│   ├── src/
│   │   ├── index.ts                    # Server entry, routing, middleware
│   │   ├── controllers/
│   │   │   ├── search_lcel.ts          # Web search controller
│   │   │   └── light_rag_kb.ts         # KB ingest + ask controller
│   │   ├── routes/
│   │   │   ├── search_lcel.ts          # POST /api/v1/search
│   │   │   └── light_rag_kb.ts         # KB endpoints
│   │   ├── search_tool/
│   │   │   ├── index.ts                # LCEL chain orchestrator
│   │   │   ├── routeStrategy.ts        # Pattern-based router
│   │   │   ├── types.ts                # TypeScript types
│   │   │   ├── validate.ts             # Output validation
│   │   │   └── pipelines/
│   │   │       ├── web.ts              # Web search pipeline
│   │   │       └── direct.ts           # Direct LLM pipeline
│   │   ├── light_rag_kb/
│   │   │   ├── ingest.ts               # Document ingestion
│   │   │   ├── ask.ts                  # Query answering
│   │   │   ├── chunk.ts                # Text chunking (1000 chars, 200 overlap)
│   │   │   └── store.ts                # In-memory vector store
│   │   ├── shared/
│   │   │   ├── env.ts                  # Zod-validated env config
│   │   │   └── models.ts               # LLM provider factory
│   │   └── utils/
│   │       ├── webSearch.ts            # Tavily API client
│   │       ├── openUrl.ts              # HTML scraper
│   │       ├── summarize.ts            # LLM summarization
│   │       └── schema.ts               # Zod schemas
│   ├── tests/
│   │   └── api.test.ts                 # API tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── vercel.json
│
└── client/                             # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                # Landing (Spline 3D + modules)
    │   │   ├── layout.tsx              # Root layout
    │   │   ├── globals.css             # Global styles
    │   │   ├── kb/
    │   │   │   └── page.tsx            # KB page
    │   │   └── search/
    │   │       └── page.tsx            # Search page
    │   ├── components/
    │   │   └── ui/
    │   │       ├── header.tsx
    │   │       ├── footer.tsx
    │   │       ├── Hero.tsx
    │   │       ├── ModuleCards.tsx
    │   │       ├── GlitchText.tsx
    │   │       ├── RevealWords.tsx
    │   │       ├── input.tsx
    │   │       ├── textarea.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       ├── ChatSynthesizing.tsx
    │   │       ├── SplineScene.tsx
    │   │       ├── TiltCard.tsx
    │   │       ├── background/
    │   │       │   ├── Grid.tsx
    │   │       │   ├── AmbientOrbs.tsx
    │   │       │   ├── MouseSpotlight.tsx
    │   │       │   └── NoiseGrain.tsx
    │   │       └── kb/
    │   │           ├── KBIngest.tsx
    │   │           └── KBQuery.tsx
    │   ├── lib/
    │   │   ├── config.ts
    │   │   ├── types.ts
    │   │   └── utils.ts
    │   └── styles/
    └── package.json
```

---

## Tech Stack

| Layer              | Technology         | Purpose                            |
| ------------------ | ------------------ | ---------------------------------- |
| Frontend Framework | Next.js 16         | React app + API proxy routes       |
| UI Animations      | Framer Motion      | Transitions, cards, word reveals   |
| 3D Hero Scene      | Spline             | 3D background visualization        |
| Backend Framework  | Express.js         | HTTP server, routing               |
| AI Chain           | LangChain LCEL     | Pipeline orchestration & branching |
| Knowledge Base     | LightRAG           | Vector embeddings & retrieval      |
| Web Search API     | Tavily             | Real-time web results              |
| HTML Extraction    | html-to-text       | Text extraction from web pages     |
| LLM Support        | Multi-provider (1) | Pluggable via environment          |
| Validation         | Zod                | Schema enforcement                 |
| Rate Limiting      | express-rate-limit | 10 req per 10 minutes              |
| Language           | TypeScript         | Full-stack type safety             |
| Build Tool         | tsup               | Fast ESM bundling                  |
| Deployment         | Vercel             | Serverless platform                |

**(1) Supported LLM Providers:**

- Gemini (default)
- OpenAI (GPT-4/3.5)
- Groq
- Deepseek

---

## Running Locally

### Backend Setup

```bash
cd agent
yarn install
yarn dev
```

Server runs on `http://localhost:8000` by default.

### Frontend Setup

```bash
cd client
yarn install
yarn dev
```

Frontend runs on `http://localhost:3000` by default.

### Environment Variables

**Backend** (`agent/.env`):

```bash
# LLM Provider
MODEL_PROVIDER=gemini                    # Options: gemini | openai | groq | deepseek
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here

# Web Search
TAVILY_API_KEY=your_tavily_key
SEARCH_PROVIDER=tavily                   # Options: tavily | google

# Server
PORT=8000
ALLOWED_ORIGIN=http://localhost:3000

# Optional: Override default models
GEMINI_MODEL=gemini-2.0-flash
OPENAI_MODEL=gpt-4
RAG_MODEL_PROVIDER=gemini                # Optional: different model for RAG
```

**Frontend** (`client/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SPLINE_ASSET=your_spline_scene_id
```

---

## API Endpoints

Full API documentation: **[Postman Docs →](https://documenter.getpostman.com/view/20867739/2sBXcLgHZF)**

### Health Check

**`GET /status`**

```json
{
  "status": "ok",
  "timestamp": "3/8/2026, 12:00:00 PM"
}
```

### Web Search

**`POST /api/v1/search`**

Search with automatic web/direct routing.

```json
// Request
{
  "query": "What are the latest AI trends in 2026?"
}

// Response
{
  "answer": "Based on recent web results...",
  "sources": [
    "https://example.com/article1",
    "https://example.com/article2"
  ],
  "mode": "web",
  "time": 2.5
}
```

**Response:** `mode` is `"direct"` when query is answered directly; `"web"` when web results are used. `sources` array is empty for direct mode.

### Knowledge Base: Ingest Document

**`POST /api/v1/kb/ingest`**

Add documents to your private knowledge base.

```json
// Request
{
  "text": "Document content here...",
  "source": "company-policy-2026"
}

// Response
{
  "ok": true,
  "chunksCreated": 5,
  "source": "company-policy-2026"
}
```

### Knowledge Base: Ask Question

**`POST /api/v1/kb/ask`**

Query your private knowledge base.

```json
// Request
{
  "query": "What is our vacation policy?",
  "k": 3
}

// Response
{
  "answer": "Based on the ingested documents...",
  "sources": ["company-policy-2026"],
  "confidence": 0.92
}
```

**Parameters:**

- `query`: Question to ask (required)
- `k`: Number of top chunks to retrieve (1–10, default: 3)

---

## Rate Limiting

The backend enforces rate limiting:

- **Limit**: 10 requests per 10 minutes per IP
- **Response**: `429 Too Many Requests`

```json
{
  "status": "fail",
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "2026-03-08 01:00:00 PM"
}
```

---

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
vercel deploy
```

Frontend automatically deployed to: **https://axiom-ai-justuzair.vercel.app**

### Backend (Vercel)

```bash
cd agent
npm run build
vercel deploy
```

Backend automatically deployed to: **https://axiom-lcel-backend-justuzair.vercel.app**

Ensure all required environment variables are set in Vercel project settings.

---

## Features

✨ **Dual-Mode Routing**: Automatically chooses between web search and knowledge base
🔍 **Smart Pattern Detection**: No LLM calls for routing decisions
🌐 **Real-Time Web Search**: Tavily integration for current information
📚 **Private Knowledge Base**: LightRAG-powered vector search with confidence scoring
🔐 **Type-Safe**: Full TypeScript coverage (client & server)
⚡ **Rate Limited**: Built-in protection against abuse
🎨 **Beautiful UI**: 3D hero, animations, dark aesthetic
📱 **Responsive**: Works on desktop and mobile
🧩 **Pluggable LLMs**: Switch between Gemini, OpenAI, Groq, Deepseek
🔗 **Cited Answers**: All web results include source URLs
💯 **Confidence Scores**: KB responses include retrieval confidence

---

## Development Notes

### Testing

```bash
cd agent
yarn test
```

### Building for Production

```bash
# Backend
cd agent
yarn build

# Frontend
cd client
yarn build
```

### Key Configuration Files

- **Backend**: `agent/tsup.config.ts`, `agent/vercel.json`
- **Frontend**: `client/next.config.ts`
- **Environment**: Use `.env` or `.env.local` locally; set via Vercel dashboard for production

---

<div align="center">

Built with ❤️ by **[justuzair](https://github.com/justuzair)**

**[Frontend](https://axiom-ai-justuzair.vercel.app)** · **[Backend](https://axiom-lcel-backend-justuzair.vercel.app)** · **[API Docs](https://documenter.getpostman.com/view/20867739/2sBXcLgHZF)**

</div>
