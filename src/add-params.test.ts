import assert from "node:assert/strict";
import test from "node:test";

import { addParams } from "./add-params.ts";

test("addParams: basic usage", () => {
  assert.equal(
    addParams("https://ulti.js.org", { quantity: 3 }),
    "https://ulti.js.org/?quantity=3",
  );

  assert.equal(
    addParams("https://ulti.js.org", { quantity: 3, share: false }),
    "https://ulti.js.org/?quantity=3&share=false",
  );

  assert.equal(
    addParams(
      new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto"),
      { year: 2001, month: "May" },
    ),
    "https://developer.mozilla.org/en-US/docs?year=2001&month=May",
  );
});

test("addParams: asURL option returns a URL instance", () => {
  const result = addParams("https://ultirequiem.com", { hey: 34 }, {
    asURL: true,
  });
  assert.ok(result instanceof URL);
  assert.equal(result.toString(), "https://ultirequiem.com/?hey=34");
});

test("addParams: arrays, nested objects, and defaults from the polished example", () => {
  assert.equal(
    addParams("https://api.com", {
      page: 1,
      tags: ["tech", "ai"],
      filter: { price: { min: 10, max: 100 } },
      draft: false,
    }),
    "https://api.com/?page=1&tags=tech&tags=ai&filter.price.min=10&filter.price.max=100&draft=false",
  );
});

test("addParams: default merge is replace", () => {
  assert.equal(
    addParams("https://site.com?page=1", { page: 2 }),
    "https://site.com/?page=2",
  );
});

test("addParams: merge append keeps both values", () => {
  assert.equal(
    addParams("https://site.com?page=1", { page: 2 }, { merge: "append" }),
    "https://site.com/?page=1&page=2",
  );
});

test("addParams: merge preserve keeps the existing value", () => {
  assert.equal(
    addParams("https://site.com?page=1", { page: 2 }, { merge: "preserve" }),
    "https://site.com/?page=1",
  );
});

test("addParams: relative URLs work without a base", () => {
  assert.equal(
    addParams("/api", { day: 2 }),
    "/api?day=2",
  );
});
