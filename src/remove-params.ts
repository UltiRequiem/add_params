import { parseUrlLike, reassemble } from "./url-like.ts";
import { decodePairs, serializePairs } from "./serialize.ts";

/**
 * Remove one or more query parameters from a URL.
 *
 * @example
 * ```ts
 * removeParams("https://api.com?page=1&draft=true", "draft");
 * //=> "https://api.com/?page=1"
 *
 * removeParams("https://api.com?page=1&draft=true&x=1", ["draft", "x"]);
 * //=> "https://api.com/?page=1"
 * ```
 */
export function removeParams(
  url: string | URL,
  keys: string | string[],
  options?: { asURL?: false },
): string;
export function removeParams(
  url: string | URL,
  keys: string | string[],
  options: { asURL: true },
): URL;
export function removeParams(
  url: string | URL,
  keys: string | string[],
  options: { asURL?: boolean } = {},
): string | URL {
  const toRemove = new Set(Array.isArray(keys) ? keys : [keys]);
  const parsed = parseUrlLike(url);
  const remaining = decodePairs(parsed.search).filter(([key]) =>
    !toRemove.has(key)
  );
  const search = serializePairs(remaining);
  return reassemble(parsed, search, options.asURL ?? false);
}
