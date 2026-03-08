import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Dynamic query templates ────────────────────────────────────────────────
export const getDynamicQuery = (label: string) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  const map: Record<string, string> = {
    "Quantum Computing": `Latest breakthroughs in Quantum Computing as of ${month} ${year}`,
    "Global News": `Top 5 significant global news stories for ${month} ${year}`,
    "Blockchain Trends": `State of blockchain technology and crypto regulations in ${year}`,
    "AI Breakthroughs": `Most impactful AI research papers and model releases in ${month} ${year}`,
    "Space Exploration": `Upcoming space missions and astronomical events scheduled for ${year}`,
  };
  return map[label] || label;
};

// ── Error parsing ──────────────────────────────────────────────────────────
export function parseError(raw: string): { code?: string; message: string } {
  const codeMatch = raw.match(/\b(\d{3})\b/);
  return {
    code: codeMatch?.[1],
    message: raw.replace(/^(tavily\s+)?error:\s*/i, "").trim(),
  };
}
