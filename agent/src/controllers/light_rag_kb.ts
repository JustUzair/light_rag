import { NextFunction, Request, Response } from "express";
import { askKB } from "../light_rag_kb/ask.js";
import {
  IngestBodySchema,
  IngestBody,
  AskBodySchema,
  AskBody,
} from "../utils/schema.js";
import { ingestText } from "../light_rag_kb/ingest.js";
import { resetStore } from "../light_rag_kb/store.js";

export default {
  askKB: async (req: Request, res: Response) => {
    try {
      const body = AskBodySchema.parse(req.body) as AskBody;
      const result = await askKB(body.query, body.k ?? 2);
      return res.status(200).json({
        answer: result.answer,
        sources: result.sources,
        confidence: result.confidence,
      });
    } catch (err) {
      return res.status(400).json({
        error:
          (err as Error).message ?? "Some error occurred while ingesting text",
      });
    }
  },
  ingest: async (req: Request, res: Response) => {
    try {
      const body = IngestBodySchema.parse(req.body) as IngestBody;
      //   console.debug(`Body\n`, body);
      const result = await ingestText({
        text: body.text,
        source: body.source,
      });

      return res.status(200).json({ ok: true, ...result });
    } catch (err) {
      return res.status(400).json({
        error:
          (err as Error).message ?? "Some error occurred while ingesting text",
      });
    }
  },
  reset: async (_: Request, res: Response) => {
    resetStore();
    return res.status(200).json({ ok: true });
  },
};
