import assert from "node:assert/strict";
import test from "node:test";

import { mergeParams } from "./merge-params.ts";

test("mergeParams: replaces by default", () => {
  assert.equal(
    mergeParams("https://site.com?page=1", { page: 2 }),
    "https://site.com/?page=2",
  );
});

test("mergeParams: asURL option", () => {
  const result = mergeParams("https://site.com?page=1", { page: 2 }, {
    asURL: true,
  });
  assert.ok(result instanceof URL);
  assert.equal(result.search, "?page=2");
});
