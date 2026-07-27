import assert from "node:assert/strict";
import test from "node:test";

import { query } from "./query-builder.ts";

test("query: fluent chaining", () => {
  const result = query("https://site.com")
    .set("page", 1)
    .append("tags", "a")
    .append("tags", "b")
    .delete("draft")
    .toString();

  assert.equal(result, "https://site.com/?page=1&tags=a&tags=b");
});

test("query: set replaces an existing value", () => {
  assert.equal(
    query("https://site.com?page=1").set("page", 2).toString(),
    "https://site.com/?page=2",
  );
});

test("query: append adds alongside an existing value", () => {
  assert.equal(
    query("https://site.com?page=1").append("page", 2).toString(),
    "https://site.com/?page=1&page=2",
  );
});

test("query: toURL returns a URL instance", () => {
  const result = query("https://site.com").set("page", 1).toURL();
  assert.ok(result instanceof URL);
  assert.equal(result.search, "?page=1");
});
