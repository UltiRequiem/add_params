# ultraqs

[![Code Coverage](https://codecov.io/gh/UltiRequiem/ultraqs/branch/main/graph/badge.svg)](https://codecov.io/gh/UltiRequiem/ultraqs)
[![JSR](https://jsr.io/badges/@ultirequiem/ultraqs)](https://jsr.io/@ultirequiem/ultraqs)

The safest way to build
[Query Parameters](https://wikipedia.org/wiki/Query_string) in TypeScript — zero
dependencies, works identically in Deno, Node, Bun, and the browser.

## Install

Published on [JSR](https://jsr.io/@ultirequiem/ultraqs) — works everywhere from
one package, no separate npm publish needed.

```sh
# Deno
deno add @ultirequiem/ultraqs

# Node / Bun / any npm-compatible tool
npx jsr add @ultirequiem/ultraqs
```

```javascript
import { addParams } from "@ultirequiem/ultraqs";

addParams("https://ultirequiem.com", { page: 33, author: "Me", share: false });
//=> https://ultirequiem.com/?page=33&author=Me&share=false

addParams("https://api.com", {
  tags: ["tech", "ai"],
  filter: { price: { min: 10, max: 100 } },
});
//=> https://api.com/?tags=tech&tags=ai&filter.price.min=10&filter.price.max=100
```

## API

| Function                              | What it does                                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `addParams(url, params, options?)`    | Add/merge params into a URL. `options.asURL: true` returns a `URL` instead of a string.                                          |
| `removeParams(url, keys)`             | Delete one or more keys from a URL's query string.                                                                               |
| `mergeParams(url, params, options?)`  | Same as `addParams`, named for readability.                                                                                      |
| `stringify(params, options?)`         | Plain object → query string, no URL involved.                                                                                    |
| `parse(input, options?)`              | Query string/URL → object. Pass `{ schema }` for typed output.                                                                   |
| `query(url)`                          | Fluent builder: `.set()` / `.append()` / `.delete()` / `.toString()` / `.toURL()`.                                               |
| `build(template, params, options?)`   | `"/users/:id"` + `{ id: 1 }` → `"/users/1"`, with an optional `query`.                                                           |
| `t`, `validateParams(schema, params)` | Tiny schema builder (`t.string()`, `t.number().min().max()`, `t.boolean()`, `t.array()`) for typed `parse()`/`validateParams()`. |

### Options (shared across the functions above)

| Option          | Values                                    | Default     | Effect                                                                                       |
| --------------- | ----------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `array`         | `"repeat"` \| `"comma"` \| `"bracket"`    | `"repeat"`  | `tags=a&tags=b` / `tags=a,b` / `tags[]=a&tags[]=b`                                           |
| `nested`        | `"dot"` \| `"bracket"`                    | `"dot"`     | `filter.price.min=10` / `filter[price][min]=10`                                              |
| `merge`         | `"replace"` \| `"append"` \| `"preserve"` | `"replace"` | How a new value interacts with an existing same-key value                                    |
| `strict`        | `boolean`                                 | `false`     | Throw on values with no serialization rule instead of best-effort `String()`                 |
| `sort`          | `boolean`                                 | `false`     | Sort output by key for deterministic/cacheable URLs                                          |
| `encode`        | `boolean`                                 | `true`      | `false` skips percent-encoding (debug/display only)                                          |
| `signatureSafe` | `boolean`                                 | `false`     | AWS SigV4-style canonical query string: sorted, strictly RFC 3986-encoded, flat scalars only |

### Schema-typed parsing

`t.*()` schemas only need a `.parse(value: unknown): T` method — the same shape
a real [Zod](https://zod.dev)/Valibot schema exposes, so you can mix them in
with **zero dependency** on either:

```ts
import { parse, t } from "@ultirequiem/ultraqs";

parse("?page=2&tags=js,ts", {
  array: "comma",
  schema: { page: t.number(), tags: t.array(t.string()) },
});
//=> { page: 2, tags: ["js", "ts"] }
```

Since query values arrive as strings, prefer
`z.coerce.number()`/`z.coerce.boolean()` over `z.number()`/`z.boolean()` when
passing in a real Zod schema.

## Documentation

Full API reference is auto-generated on
[jsr.io/@ultirequiem/ultraqs](https://jsr.io/@ultirequiem/ultraqs) 📄

## Versioning

We use [Semantic Versioning](http://semver.org). For the versions available, see
the [tags](https://github.com/UltiRequiem/ultraqs/tags) 🏷️

## Licence

Licensed under the MIT License 📄
