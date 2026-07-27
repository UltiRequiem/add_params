import assert from "node:assert/strict";
import test from "node:test";

import { addParams } from "./mod.ts";

test("Add Parameters", () => {
  assert.equal(
    addParams("https://ulti.js.org", { quantity: 3 }),
    "https://ulti.js.org/?quantity=3",
  );

  assert.equal(
    addParams("https://ulti.js.org", { quantity: 3, share: false }),
    "https://ulti.js.org/?quantity=3&share=false",
  );

  assert.equal(
    addParams("https://ulti.js.org", { greetings: "Howdy", page: 34 }),
    "https://ulti.js.org/?greetings=Howdy&page=34",
  );

  assert.equal(
    addParams(
      new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto"),
      { year: 2001, month: "May" },
    ),
    "https://developer.mozilla.org/en-US/docs?year=2001&month=May",
  );

  // TypeScript Overloads

  const isString: string = addParams("https://ultirequiem.com", { hey: 34 });

  assert.equal(typeof isString, "string");

  const isSimpleString: string = addParams(
    "https://ultirequiem.com",
    { hey: 34 },
    true,
  );

  assert.equal(typeof isSimpleString, "string");

  const isURL: URL = addParams("https://ultirequiem.com", { hey: 34 }, false);

  assert.ok(isURL instanceof URL);
});
