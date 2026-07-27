import { parseUrlLike, reassemble } from "./url-like.ts";
import { combine, decodePairs, flatten, serializePairs } from "./serialize.ts";

/** Fluent builder returned by {@link query}. Every method returns `this` for chaining. */
export interface QueryBuilder {
  /** Replaces any existing value(s) for `key`. */
  set(key: string, value: unknown): QueryBuilder;
  /** Adds `value` for `key` alongside any existing value(s). */
  append(key: string, value: unknown): QueryBuilder;
  /** Removes `key` entirely. */
  delete(key: string): QueryBuilder;
  toString(): string;
  toURL(): URL;
}

/**
 * A fluent, chainable way to build up a URL's query string.
 *
 * @example
 * ```ts
 * query("https://site.com")
 *   .set("page", 1)
 *   .append("tags", "a")
 *   .append("tags", "b")
 *   .delete("draft")
 *   .toString();
 * //=> "https://site.com/?page=1&tags=a&tags=b"
 * ```
 */
export function query(url: string | URL): QueryBuilder {
  const parsed = parseUrlLike(url);
  let pairs = decodePairs(parsed.search);

  const builder: QueryBuilder = {
    set(key: string, value: unknown): QueryBuilder {
      pairs = combine(pairs, flatten({ [key]: value }), "replace");
      return builder;
    },
    append(key: string, value: unknown): QueryBuilder {
      pairs = combine(pairs, flatten({ [key]: value }), "append");
      return builder;
    },
    delete(key: string): QueryBuilder {
      pairs = pairs.filter(([existingKey]) => existingKey !== key);
      return builder;
    },
    toString(): string {
      return reassemble(parsed, serializePairs(pairs), false) as string;
    },
    toURL(): URL {
      return reassemble(parsed, serializePairs(pairs), true) as URL;
    },
  };

  return builder;
}
