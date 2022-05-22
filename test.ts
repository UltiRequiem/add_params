import {
  assertEquals,
  assertInstanceOf,
} from "https://deno.land/std@0.140.0/testing/asserts.ts";

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
