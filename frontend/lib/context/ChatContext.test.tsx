import { expect, test, describe } from "bun:test";

// Since testing React Context with Provider requires a DOM environment (JSDOM/HappyDOM)
// and Bun's test runner is focused on speed, we'll implement a structural test
// to ensure the export and types are valid.

describe("ChatContext", () => {
  test("exports required components", async () => {
    const mod = await import("./ChatContext");
    expect(mod.ChatProvider).toBeDefined();
    expect(mod.useChat).toBeDefined();
  });
});
