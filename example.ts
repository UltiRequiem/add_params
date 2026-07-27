import { addParams, build, parse, query, stringify, t } from "./mod.ts";

console.log(
  addParams("https://ultirequiem.com", { hello: "world", author: "Eliaz" }),
);
//=> https://ultirequiem.com/?hello=world&author=Eliaz

console.log(
  addParams("https://api.com", {
    tags: ["tech", "ai"],
    filter: { price: { min: 10, max: 100 } },
  }),
);
//=> https://api.com/?tags=tech&tags=ai&filter.price.min=10&filter.price.max=100

console.log(
  query("https://site.com")
    .set("page", 1)
    .append("tags", "a")
    .append("tags", "b")
    .toString(),
);
//=> https://site.com/?page=1&tags=a&tags=b

console.log(stringify({ page: 2, tags: ["js", "ts"] }, { array: "comma" }));
//=> page=2&tags=js,ts

console.log(
  parse("?page=2&tags=js,ts", {
    array: "comma",
    schema: { page: t.number(), tags: t.array(t.string()) },
  }),
);
//=> { page: 2, tags: ["js", "ts"] }

console.log(build("/users/:id", { id: 1 }, { query: { page: 2 } }));
//=> /users/1?page=2
