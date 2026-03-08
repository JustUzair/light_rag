import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { makeModel } from "../shared/models.js";
import { KBAskResult, KBSource } from "./../search_tool/types.js";
import { getVectorStore } from "./store.js";
/*
1. embed the query
vector >>> array of numbers 
@note need to use same embeddings model that we used to index the Knowledge Base

2. retrieve similar chunks from vector store
build ans >>> prompt >>> tell the model >>> model answers the query
*/

export async function askKB(query: string, k = 2): Promise<KBAskResult> {
  const validatedQuery = (query ?? "").trim();
  if (!validatedQuery) throw new Error("No query provided!!!");

  const store = getVectorStore();
  const embedQuery = await store.embeddings.embedQuery(validatedQuery);

  // pairs = [[Document, {pageContent, metadata}],[Document, {pageContent, metadata}]]...
  const pairs = await store.similaritySearchVectorWithScore(embedQuery, k);

  const chunks = pairs.map(([doc]) => {
    return {
      text: doc.pageContent || "",
      metadata: doc.metadata || {},
    };
  });

  const scores = pairs.map(([_, score]) => {
    return Number(score) || 0;
  });

  // prompt context for llm to answer from
  const context = generateContext(chunks);

  const answer = await buildAnswerFromLLM(validatedQuery, context);
  const sources: KBSource[] = chunks.map(chunk => {
    return {
      source: String(chunk.metadata.source ?? "unknown"),
      chunkId: Number(chunk.metadata.chunkId) ?? 0,
    };
  });

  const confidence = buildConfidence(scores);

  return {
    answer,
    sources,
    confidence,
  };
}

function generateContext(chunks: { text: string; metadata: any }[]) {
  return chunks
    .map(({ text, metadata }, i) => {
      return [
        `[#${i + 1} ${String(metadata?.source ?? "unknown")} #${String(metadata?.chunkId ?? "?")}]`,
        text ?? "Empty Text",
      ].join("\n");
    })
    .join("\n\n----\n\n");
}

async function buildAnswerFromLLM(query: string, context: string) {
  const model = makeModel({ temperature: 0.3 });
  const res = await model.invoke([
    new SystemMessage(
      [
        "Role: You are a high-precision factual assistant.",
        "Constraint: Answer questions ONLY using the provided context. Do not use outside knowledge or previous training data.",
        "Integrity: If the context does not contain the answer, state: 'I cannot answer this based on the provided information.' Do not fabricate details or external citations.",
        "Tone: Maintain a neutral, objective, and non-promotional tone. Eliminate all marketing language or fluff.",
        "Format: Be concise. Limit responses to 4-5 well-structured sentences.",
      ].join("\n"),
    ),
    new HumanMessage(
      [
        "### USER QUESTION",
        `"${query}"`,
        "",
        "### PROVIDED CONTEXT",
        "Below are the specific document excerpts to use for your answer:",
        "-----------------------",
        context || "NO RELEVANT CONTEXT FOUND",
        "-----------------------",
        "",
        "Reminder: If the answer is not in the text above, do not attempt to answer.",
      ].join("\n"),
    ),
  ]);

  const finalizedRes =
    typeof res.content === "string" ? res.content : String(res.content);
  return finalizedRes.trim().slice(0, 1500);
}

function buildConfidence(scores: number[]): number {
  if (!scores.length) return 0;

  const clamped = scores.map(score => Math.max(0, Math.min(1, score))); // if score is 0.5 return 0, if score is 1.2 return 2
  const avg = clamped.reduce((a, b) => a + b, 0) / clamped.length;

  return Math.round(avg * 100) / 100;
}
