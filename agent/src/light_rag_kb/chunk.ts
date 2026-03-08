import { Document } from "@langchain/core/documents";
export const CHUNK_SIZE = 1000; // each chunk is 1000 chars
export const CHUNK_WINDOW = 200; // overlap of 200 chars for context

export function chunk(text: string, source: string): Array<Document> {
  const clean = (text ?? "").replace(/\r\n/g, "\n");
  //   console.debug(`Clean: ${clean}`);
  const docs: Document[] = [];
  if (!clean.trim()) return docs;

  // step is maximum of
  const step = Math.max(1, CHUNK_SIZE - CHUNK_WINDOW);

  let start = 0;
  let chunkId = 0;
  while (start < clean.length) {
    const end = Math.min(clean.length, start + CHUNK_SIZE);
    const slice = clean.slice(start, end);

    if (slice.length > 0) {
      const doc = new Document({
        pageContent: slice,
        metadata: {
          source: source,
          chunkId,
        },
      });
      docs.push(doc);
    }
    chunkId += 1;
    start += step;
  }
  return docs;
}
