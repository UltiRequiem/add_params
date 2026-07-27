import assert from "node:assert/strict";
import test from "node:test";

import { parseUrlLike, reassemble } from "./url-like.ts";

test("parseUrlLike: absolute URL", () => {
  const parsed = parseUrlLike("https://example.com/api?a=1#top");
  assert.equal(parsed.absolute, true);
  assert.equal(parsed.prefix, "https://example.com");
  assert.equal(parsed.pathname, "/api");
  assert.equal(parsed.search, "a=1");
  assert.equal(parsed.hash, "top");
});

test("parseUrlLike: relative path", () => {
  const parsed = parseUrlLike("/users/1?page=2#section");
  assert.equal(parsed.absolute, false);
  assert.equal(parsed.prefix, "");
  assert.equal(parsed.pathname, "/users/1");
  assert.equal(parsed.search, "page=2");
  assert.equal(parsed.hash, "section");
});

test("parseUrlLike: bare query string", () => {
  const parsed = parseUrlLike("?page=1&tags=a");
  assert.equal(parsed.absolute, false);
  assert.equal(parsed.pathname, "");
  assert.equal(parsed.search, "page=1&tags=a");
});

test("reassemble: absolute, string and URL", () => {
  const parsed = parseUrlLike("https://example.com/api");
  assert.equal(reassemble(parsed, "a=1", false), "https://example.com/api?a=1");
  assert.ok(reassemble(parsed, "a=1", true) instanceof URL);
});

test("reassemble: relative stays a string", () => {
  const parsed = parseUrlLike("/users/1");
  assert.equal(reassemble(parsed, "a=1", false), "/users/1?a=1");
});

test("reassemble: asURL throws for relative input", () => {
  const parsed = parseUrlLike("/users/1");
  assert.throws(() => reassemble(parsed, "a=1", true), TypeError);
});
