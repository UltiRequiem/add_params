# ultraqs

[![Code Coverage](https://codecov.io/gh/UltiRequiem/add_params/branch/main/graph/badge.svg)](https://codecov.io/gh/UltiRequiem/add_params)
[![Deno Doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/add_params/mod.ts)

Add [Query Parameters](https://wikipedia.org/wiki/Query_string) to an URL.

## Usage

The API is the same on all this platforms ✔️

### [Deno 🦕](https://deno.land/x/add_params)

```javascript
import { addParams } from "https://deno.land/x/add_params/mod.ts";

addParams("https://ultirequiem.com", { page: 33, author: "Me", share: false });
//=> https://ultirequiem.com/?page=33&author=Me&share=false

addParams(new URL("/api", "https://example.com"), { day: 2 });
//=> https://example.com/api?day=2
```

### [Node.js 🐢🚀](https://npmjs.com/package/ultraqs)

```javascript
import { addParams } from "ultraqs";
```

### [Browser 🌐](https://developer.mozilla.org/en-US/docs/Glossary/Browser)

You can use any [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) 🔥

Eg 👉
[ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) ↔️
[SkyPack](https://cdn.skypack.dev/ultraqs) 🆚
[Script Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) ↔️
[JSDelivr](https://cdn.jsdelivr.net/npm/ultraqs)

## Documentation

Is hosted on
[Deno Doc](https://doc.deno.land/https://deno.land/x/add_params/mod.ts) 📄

## Support

Open an Issue, I will check it a soon as possible 👀

If you want to hurry me up a bit
[send me a tweet](https://twitter.com/UltiRequiem) 😆

Consider [supporting me on Patreon](https://patreon.com/UltiRequiem) if you like
my work 🙏

Don't forget to start the repo ⭐

## Authors

[Eliaz Bobadilla](https://ultirequiem.com) - Creator and Maintainer 💪

See also the full list of
[contributors](https://github.com/UltiRequiem/add_params/contributors) who
participated in this project ✨

## Versioning

We use [Semantic Versioning](http://semver.org). For the versions available, see
the [tags](https://github.com/UltiRequiem/add_params/tags) 🏷️

## Licence

Licensed under the MIT License 📄
