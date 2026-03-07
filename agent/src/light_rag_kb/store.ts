import { TaskType } from "@google/generative-ai";
import { EmbeddingsProvider } from "./../search_tool/types.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
/*
embeddings + vector store
kb brain -> knowledge base
choose an embedding model -> store embeddings in RAM


Core concepts:
-> embeddings model -> turns text to array of numbers
-> diff providers use different vector spaces

Vector Store:
- is like a searchable index
"query" ===> vector store finds closest chunks
*/

function getProvider(): EmbeddingsProvider {
  const currentProvider = (
    process.env.RAG_MODEL_PROVIDER ?? "gemini"
  ).toLowerCase();

  return (
    currentProvider === "gemini" ? "google" : "openai"
  ) as EmbeddingsProvider;
}

function makeOpenAiEmbeddings() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }
  return new OpenAIEmbeddings({
    apiKey,
    model: "text-embedding-3-small",
  });
}
function makeGoogleEmbeddings() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Google API key not found");
  }
  return new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });
}
export function createEmbeddings(
  provider: EmbeddingsProvider,
): OpenAIEmbeddings<number[]> | GoogleGenerativeAIEmbeddings {
  return provider === "google"
    ? makeGoogleEmbeddings()
    : makeOpenAiEmbeddings();
}

// Create Vector Store from previous provider state or fresh provider state
let store: MemoryVectorStore | null = null;

let currentProvider: EmbeddingsProvider | null = null;

export function getVectorStore(): MemoryVectorStore {
  let provider = getProvider();
  if (store && currentProvider === provider) {
    return store;
  }
  store = new MemoryVectorStore(createEmbeddings(provider));
  currentProvider = provider;
  return store;
}

// get vector store
// add documents -> docs
// store in memory
export async function addChunks(docs: Document[]): Promise<number> {
  if (!Array.isArray(docs) || docs.length === 0) return 0;

  const store = getVectorStore();
  await store.addDocuments(docs);
  return docs.length;
}

export function resetStore() {
  store = null;
  currentProvider = null;
}
