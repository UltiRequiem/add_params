import assert from "node:assert/strict";
import test from "node:test";

import { parse } from "./parse.ts";
import { stringify } from "./stringify.ts";
import { t } from "./schema.ts";

test("parse: bare query string, no schema", () => {
  assert.deepEqual(parse("?page=1&tags=a&tags=b"), {
    page: "1",
    tags: ["a", "b"],
  });
});

test("parse round-trips stringify: default repeat + dot", () => {
  const input = {
    page: 1,
    tags: ["a", "b"],
    filter: { price: { min: 10 } },
  };
  const encoded = stringify(input);
  assert.deepEqual(parse(encoded), {
    page: "1",
    tags: ["a", "b"],
    filter: { price: { min: "10" } },
  });
});

test("parse round-trips stringify: comma array", () => {
  const encoded = stringify({ tags: ["a", "b"] }, { array: "comma" });
  assert.deepEqual(parse(encoded, { array: "comma" }), { tags: ["a", "b"] });
});

test("parse round-trips stringify: bracket array", () => {
  const encoded = stringify({ tags: ["a", "b"] }, { array: "bracket" });
  assert.deepEqual(parse(encoded, { array: "bracket" }), { tags: ["a", "b"] });
});

test("parse round-trips stringify: bracket nested", () => {
  const encoded = stringify({ filter: { price: { min: 10 } } }, {
    nested: "bracket",
  });
  assert.deepEqual(parse(encoded, { nested: "bracket" }), {
    filter: { price: { min: "10" } },
  });
});

test("parse: schema option produces typed output", () => {
  const result = parse("?page=2&tags=js,ts", {
    array: "comma",
    schema: { page: t.number(), tags: t.array(t.string()) },
  });
  assert.deepEqual(result, { page: 2, tags: ["js", "ts"] });
});

test("parse: schema works with a Zod-shaped (duck-typed) schema, no Zod dependency", () => {
  const zodLike = {
    parse(value: unknown): number {
      if (typeof value !== "string") throw new TypeError("expected string");
      return Number(value) * 2;
    },
  };
  const result = parse("?page=3", { schema: { page: zodLike } });
  assert.deepEqual(result, { page: 6 });
});
