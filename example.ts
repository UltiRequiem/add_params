import { addParams } from "./mod.ts";

console.log(
  addParams("https://ultirequiem.com", { hello: "world", author: "Eliaz" }),
);

//=> https://ultirequiem.com/?hello=world&author=Eliaz
