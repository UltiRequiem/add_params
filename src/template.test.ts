import assert from "node:assert/strict";
import test from "node:test";

import { build } from "./template.ts";

test("build: substitutes placeholders", () => {
  assert.equal(build("/users/:id", { id: 1 }), "/users/1");
});

test("build: appends a query string", () => {
  assert.equal(
    build("/users/:id", { id: 1 }, { query: { page: 2 } }),
    "/users/1?page=2",
  );
});

test("build: throws on a missing placeholder", () => {
  assert.throws(() => build("/users/:id", {}), TypeError);
});
