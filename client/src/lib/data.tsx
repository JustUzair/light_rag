import {
  Globe2,
  Database,
  Zap,
  Network,
  Binary,
  Layers,
  Newspaper,
} from "lucide-react";
import { Syne } from "next/font/google";

export const SPLINE_URL = process.env.NEXT_PUBLIC_SPLINE_ASSET as string;

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#@!%<>/\\";

export const FEATURES = [
  { icon: <Globe2 size={11} />, label: "Live Web Synthesis" },
  { icon: <Database size={11} />, label: "Private RAG Corpus" },
  { icon: <Network size={11} />, label: "Dual-Mode Pipeline" },
  { icon: <Zap size={11} />, label: "LangChain LCEL" },
  { icon: <Binary size={11} />, label: "LightRAG Embeddings" },
];

export const MODULES = [
  {
    href: "/search",
    module: "01",
    title: "Web Search",
    desc: "Real-time synthesis across live web sources. Tavily retrieval + multi-step LLM pipeline. Every claim cited.",
    icon: <Globe2 size={20} />,
    accent: { r: 124, g: 58, b: 237 }, // violet
    labelTag: "INTELLIGENCE",
  },
  {
    href: "/kb",
    module: "02",
    title: "Knowledge Base",
    desc: "Ingest private documents. Query your corpus via LightRAG embeddings. No web, pure distilled signal.",
    icon: <Database size={20} />,
    accent: { r: 6, g: 182, b: 212 }, // cyan
    labelTag: "RETRIEVAL",
  },
];

export const SUGGESTIONS = [
  { label: "Quantum Computing", icon: <Zap size={14} />, category: "TECH" },
  { label: "Global News", icon: <Globe2 size={14} />, category: "CURRENT" },
  {
    label: "Blockchain Trends",
    icon: <Binary size={14} />,
    category: "FINANCE",
  },
  {
    label: "AI Breakthroughs",
    icon: <Layers size={14} />,
    category: "RESEARCH",
  },
  {
    label: "Space Exploration",
    icon: <Newspaper size={14} />,
    category: "SCIENCE",
  },
];

export const CHAT_STORAGE_KEY = "axiom_search_history";

// ── Accent helpers ──────────────────────────────────────────────────────────
export const V = {
  600: "rgba(124,58,237,",
  400: "rgba(167,139,250,",
  grid: "rgba(124,58,237,0.022)",
  orb1: "rgba(124,58,237,0.07)",
  orb2: "rgba(167,139,250,0.05)",
  border: "rgba(124,58,237,0.1)",
  borderHover: "rgba(124,58,237,0.38)",
  leftBar: "rgba(124,58,237,0.2)",
  responseBar: "rgba(124,58,237,0.22)",
  glow: "0 0 24px rgba(124,58,237,0.32)",
};

export const font = Syne({ subsets: ["latin"], weight: ["700", "800"] });
