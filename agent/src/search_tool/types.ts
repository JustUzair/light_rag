/* Agent Paths: 
    1. Web >>> Browse, Summarize, source/cite urls
    2. Direct >>> Ask AI Model
*/

export type AgentMode = "web" | "direct";
export type Candidate = {
  answer: string;
  sources: string[];
  mode: AgentMode;
};

export type EmbeddingsProvider = "openai" | "google";
export type IngestTextInput = {
  text: string;
  source?: string;
};

export type KBSource = {
  source: string;
  chunkId: number;
};

export type KBAskResult = {
  answer: string;
  sources: KBSource[];
  confidence: number;
};
