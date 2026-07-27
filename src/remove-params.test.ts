import assert from "node:assert/strict";
import test from "node:test";

import { removeParams } from "./remove-params.ts";

test("removeParams: single key", () => {
  assert.equal(
    removeParams("https://api.com?page=1&draft=true", "draft"),
    "https://api.com/?page=1",
  );
});

test("removeParams: multiple keys", () => {
  assert.equal(
    removeParams("https://api.com?page=1&draft=true&x=1", ["draft", "x"]),
    "https://api.com/?page=1",
  );
});

test("removeParams: asURL option", () => {
  const result = removeParams("https://api.com?page=1", "page", {
    asURL: true,
  });
  assert.ok(result instanceof URL);
  assert.equal(result.search, "");
});
