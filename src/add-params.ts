import { parseUrlLike, reassemble } from "./url-like.ts";
import { combine, decodePairs, flatten, serializePairs } from "./serialize.ts";
import type { SerializeOptions } from "./types.ts";

/**
 * Add Query Parameters to a URL.
 *
 * Query String: {@link https://wikipedia.org/wiki/Query_string}
 *
 * @param url - Absolute URL, relative path, or bare query string.
 * @param parameters - The parameters to add.
 * @param options - Serialization options; pass `{ asURL: true }` to get a `URL` back.
 *
 * @example
 * ```ts
 * addParams("https://ultirequiem.com", { hello: "world", author: "Eliaz" });
 * //=> "https://ultirequiem.com/?hello=world&author=Eliaz"
 *
 * addParams("https://api.com", { tags: ["tech", "ai"] });
 * //=> "https://api.com/?tags=tech&tags=ai"
 *
 * addParams("https://api.com", { filter: { price: { min: 10 } } });
 * //=> "https://api.com/?filter.price.min=10"
 * ```
 */
export function addParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options?: SerializeOptions & { asURL?: false },
): string;
export function addParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options: SerializeOptions & { asURL: true },
): URL;
export function addParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options: SerializeOptions & { asURL?: boolean } = {},
): string | URL {
  const parsed = parseUrlLike(url);
  const existing = decodePairs(parsed.search);
  const incoming = flatten(parameters, options);
  const merged = combine(existing, incoming, options.merge ?? "replace");
  const search = serializePairs(merged, options);
  return reassemble(parsed, search, options.asURL ?? false);
}
