import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

import app from "../src/index.js";

const API_URL = "/api/v1";

describe("Knowledge Base System Tests", () => {
  // 1. TEST RESET
  it("should reset the knowledge base", async () => {
    const res = await request(app).post(`${API_URL}/kb/reset`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  // 2. TEST INGESTION
  it("should ingest new knowledge successfully", async () => {
    const payload = {
      text: "DePIN stands for Decentralized Physical Infrastructure Networks. It uses token incentives to build real-world infrastructure.",
      source: "https://test-source.com",
    };

    const res = await request(app).post(`${API_URL}/kb/ingest`).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  // 3. TEST KNOWLEDGE BASE (ASK)
  it("should retrieve an answer from the ingested knowledge", async () => {
    const query = {
      query: "What does DePIN stand for?",
      k: 3,
    };

    const res = await request(app).post(`${API_URL}/kb/ask`).send(query);

    expect(res.status).toBe(200);
    expect(res.body.answer).toContain(
      "Decentralized Physical Infrastructure Networks",
    );
  });

  // 4. TEST INVALID SCHEMA (Error Handling)
  it("should fail if query is missing", async () => {
    const invalidQuery = { k: 5 }; // Missing 'query' string

    const res = await request(app).post(`${API_URL}/kb/ask`).send(invalidQuery);
    // Should return 400 because Zod validation failed
    expect(res.status).toBe(400);
  });
  // 5. TEST LCEL CONTEXT SEARCHING
  it("should return a grounded answer and source citations", async () => {
    const res = await request(app).post(`${API_URL}/search`).send({
      query: "What is Ethereum and its L1 competitors as of 2026?",
      k: 5,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(res.body).toHaveProperty("sources");
    expect(Array.isArray(res.body.sources)).toBe(true);
    expect(res.body.answer).toContain("Ethereum");
  });

  it("should return 400 for missing query", async () => {
    const res = await request(app).post(`${API_URL}/search`).send({ k: 3 }); // Missing 'query'

    expect(res.status).toBe(400);
  });
});
