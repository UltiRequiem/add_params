import { addParams } from "./mod.ts";

console.log(
  addParams("https://ultirequiem.com", { hello: "world", author: "Eliaz" }),
);

//=> https://ultirequiem.com/?hello=world&author=Eliaz

console.log(
  addParams(
    new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto"),
    { year: 2001, month: "May" },
  ),
);

//=> https://developer.mozilla.org/en-US/docs?year=2001&month=May

console.log(addParams(new URL("/api", "https://example.com"), { day: 2 }));
//=> https://example.com/api?day=2
