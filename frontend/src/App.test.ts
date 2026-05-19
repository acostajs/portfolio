import { expect, test } from "bun:test";

test("App environment", () => {
  expect(process.env.NODE_ENV).toBeDefined();
});
