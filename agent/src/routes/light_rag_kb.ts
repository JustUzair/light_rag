import express from "express";
import searchLcelController from "../controllers/light_rag_kb.js";

const router = express.Router();

router.post("/ask", searchLcelController.askKB);
router.post("/ingest", searchLcelController.ingest);
router.post("/reset", searchLcelController.reset);
export default router;
