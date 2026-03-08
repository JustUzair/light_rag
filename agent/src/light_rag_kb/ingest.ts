/*
embed chunk into vectors
push vectors into memory store
return summary
*/

import { IngestTextInput } from "../search_tool/types.js";
import { chunk } from "./chunk.js";
import { addChunks } from "./store.js";

/*
 2 Pipelines
 - ingestion/indexing -> prepare knowledge
 - retrieve answers

 Method:
 1 doc >>> break into chunks >>> source #0, #1, etc
 ABCDEF... >>> AB (#0) >>> BC (#1) >>> CD (#2) ...
*/

export async function ingestText(input: IngestTextInput) {
  const raw = (input.text ?? "").trim();
  if (!raw) {
    throw new Error("No file to ingest");
  }
  const source = input.source ?? "clipboard";
  const docs = chunk(raw, source);

  const chunkCount = await addChunks(docs);

  return {
    docCount: 1,
    chunkCount,
    source,
  };
}
