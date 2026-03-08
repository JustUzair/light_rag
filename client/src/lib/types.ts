export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  mode?: "web" | "direct";
  time?: number;
};
export type IngestResult = {
  ok: boolean;
  docCount: number;
  chunkCount: number;
  source: string;
};

export type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; msg: string }
  | { type: "error"; msg: string };
export type Source = { source: string; chunkId: number };
export type AskResponse = {
  answer: string;
  sources: Source[];
  confidence: number;
};
