import { flatten, serializePairs } from "./serialize.ts";
import type { SerializeOptions } from "./types.ts";

/**
 * Serializes a plain object into a query string — no URL involved.
 *
 * @example
 * ```ts
 * stringify({ page: 2, tags: ["js", "ts"] });
 * //=> "page=2&tags=js&tags=ts"
 *
 * stringify({ tags: ["js", "ts"] }, { array: "comma" });
 * //=> "tags=js,ts"
 * ```
 */
export function stringify(
  params: Record<string, unknown>,
  options: Omit<SerializeOptions, "merge"> = {},
): string {
  const pairs = flatten(params, options);
  return serializePairs(pairs, options);
}
