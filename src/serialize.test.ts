import assert from "node:assert/strict";
import test from "node:test";

import { combine, flatten, serializePairs } from "./serialize.ts";

test("flatten: value normalization table", () => {
  assert.deepEqual(
    flatten({
      undef: undefined,
      nil: null,
      yes: true,
      no: false,
      empty: "",
      num: 3,
      emptyArray: [],
    }),
    [
      ["yes", "true"],
      ["no", "false"],
      ["empty", ""],
      ["num", "3"],
    ],
  );
});

test("flatten: keepNull keeps null as empty string", () => {
  assert.deepEqual(flatten({ nil: null }, { keepNull: true }), [["nil", ""]]);
});

test("flatten: array strategies", () => {
  assert.deepEqual(
    flatten({ tags: ["a", "b"] }, { array: "repeat" }),
    [["tags", "a"], ["tags", "b"]],
  );
  assert.deepEqual(
    flatten({ tags: ["a", "b"] }, { array: "comma" }),
    [["tags", "a,b"]],
  );
  assert.deepEqual(
    flatten({ tags: ["a", "b"] }, { array: "bracket" }),
    [["tags[]", "a"], ["tags[]", "b"]],
  );
});

test("flatten: nested object strategies", () => {
  const input = { filter: { price: { min: 10, max: 50 } } };
  assert.deepEqual(
    flatten(input, { nested: "dot" }),
    [["filter.price.min", "10"], ["filter.price.max", "50"]],
  );
  assert.deepEqual(
    flatten(input, { nested: "bracket" }),
    [["filter[price][min]", "10"], ["filter[price][max]", "50"]],
  );
});

test("flatten: strict mode throws on unsupported values", () => {
  assert.throws(
    () => flatten({ fn: () => {} }, { strict: true }),
    TypeError,
  );
  assert.doesNotThrow(() => flatten({ fn: () => {} }));
});

test("flatten: signatureSafe rejects arrays and nested objects", () => {
  assert.throws(
    () => flatten({ tags: ["a"] }, { signatureSafe: true }),
    TypeError,
  );
  assert.throws(
    () => flatten({ nested: { a: 1 } }, { signatureSafe: true }),
    TypeError,
  );
});

test("combine: replace/append/preserve merge strategies", () => {
  const existing: [string, string][] = [["page", "1"]];
  const incoming: [string, string][] = [["page", "2"]];

  assert.deepEqual(combine(existing, incoming, "replace"), [["page", "2"]]);
  assert.deepEqual(combine(existing, incoming, "append"), [
    ["page", "1"],
    ["page", "2"],
  ]);
  assert.deepEqual(combine(existing, incoming, "preserve"), [["page", "1"]]);
});

test("serializePairs: sort produces deterministic order", () => {
  const pairs: [string, string][] = [["b", "2"], ["a", "1"]];
  assert.equal(serializePairs(pairs, { sort: true }), "a=1&b=2");
});

test("serializePairs: encode:false emits raw, unescaped output", () => {
  assert.equal(
    serializePairs([["greeting", "hello world"]], { encode: false }),
    "greeting=hello world",
  );
});

test("serializePairs: signatureSafe produces AWS SigV4-style canonical encoding", () => {
  const pairs: [string, string][] = [["b", "value!"], ["a", "with space"]];
  assert.equal(
    serializePairs(pairs, { signatureSafe: true }),
    "a=with%20space&b=value%21",
  );
});
