import assert from "node:assert/strict";
import test from "node:test";

import { t, validateParams } from "./schema.ts";

test("t.string / t.number / t.boolean parse scalar values", () => {
  assert.equal(t.string().parse("hello"), "hello");
  assert.equal(t.number().parse("42"), 42);
  assert.equal(t.boolean().parse("true"), true);
  assert.equal(t.boolean().parse("false"), false);
});

test("t.number throws on non-numeric input", () => {
  assert.throws(() => t.number().parse("nope"), TypeError);
});

test("t.boolean throws on invalid input", () => {
  assert.throws(() => t.boolean().parse("yes"), TypeError);
});

test("t.number().min()/.max() enforce bounds", () => {
  const schema = t.number().min(1).max(10);
  assert.equal(schema.parse("5"), 5);
  assert.throws(() => schema.parse("0"), RangeError);
  assert.throws(() => schema.parse("11"), RangeError);
});

test("t.array() maps each element through its schema", () => {
  assert.deepEqual(t.array(t.string()).parse(["a", "b"]), ["a", "b"]);
  assert.deepEqual(t.array(t.number()).parse(["1", "2"]), [1, 2]);
  assert.deepEqual(t.array(t.string()).parse("solo"), ["solo"]);
});

test("optional() lets undefined through, default() substitutes a fallback", () => {
  assert.equal(t.number().optional().parse(undefined), undefined);
  assert.equal(t.number().default(7).parse(undefined), 7);
  assert.equal(t.number().default(7).parse("9"), 9);
});

test("validateParams validates a plain object against a schema map", () => {
  const result = validateParams(
    { page: t.number(), active: t.boolean() },
    { page: "3", active: "true" },
  );
  assert.deepEqual(result, { page: 3, active: true });
});

test("validateParams accepts a Zod-shaped (duck-typed) schema, no Zod dependency", () => {
  const zodLike = {
    parse(value: unknown): string {
      if (typeof value !== "string") throw new TypeError("expected string");
      return value.toUpperCase();
    },
  };
  const result = validateParams({ name: zodLike }, { name: "eliaz" });
  assert.deepEqual(result, { name: "ELIAZ" });
});
