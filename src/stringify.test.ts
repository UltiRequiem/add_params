import assert from "node:assert/strict";
import test from "node:test";

import { stringify } from "./stringify.ts";

test("stringify: basic object", () => {
  assert.equal(
    stringify({ page: 2, tags: ["js", "ts"] }),
    "page=2&tags=js&tags=ts",
  );
});

test("stringify: comma array strategy", () => {
  assert.equal(
    stringify({ tags: ["js", "ts"] }, { array: "comma" }),
    "tags=js,ts",
  );
});

test("stringify: sort option", () => {
  assert.equal(
    stringify({ b: 2, a: 1 }, { sort: true }),
    "a=1&b=2",
  );
});
