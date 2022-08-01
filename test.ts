import {
  assertEquals,
  assertInstanceOf,
} from "https://deno.land/std@0.150.0/testing/asserts.ts";

import { addParams } from "./mod.ts";

Deno.test("Add Parameters", () => {
  assertEquals(
    "https://ulti.js.org/?quantity=3",
    addParams("https://ulti.js.org", { quantity: 3 }),
  );

  assertEquals(
    "https://ulti.js.org/?quantity=3&share=false",
    addParams("https://ulti.js.org", { quantity: 3, share: false }),
  );

  assertEquals(
    "https://ulti.js.org/?greetings=Howdy&page=34",
    addParams("https://ulti.js.org", { greetings: "Howdy", page: 34 }),
  );

  assertEquals(
    "https://developer.mozilla.org/en-US/docs?year=2001&month=May",
    addParams(
      new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto"),
      { year: 2001, month: "May" },
    ),
  );

  // TypeScript Overloads

  const isString: string = addParams("https://ultirequiem.com", { hey: 34 });

  assertEquals(typeof isString, "string");

  const isSimpleString: string = addParams(
    "https://ultirequiem.com",
    { hey: 34 },
    true,
  );

  assertEquals(typeof isSimpleString, "string");

  const isURL: URL = addParams("https://ultirequiem.com", { hey: 34 }, false);

  assertInstanceOf(isURL, URL);
});
