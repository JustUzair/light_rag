import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 1. Environment: Important for backend/Supertest
    environment: "node",

    // 2. Globals: Allows you to use 'describe', 'it', 'expect'
    // without importing them in every single file.
    globals: true,

    // 3. Include: Tell Vitest where to find your tests
    include: ["tests/**/*.test.ts"],

    // 4. Timeout: AI calls take time!
    // We increase this so your tests don't fail while waiting for the LLM.
    testTimeout: 30000,
  },
});
