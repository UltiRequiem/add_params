import { parseUrlLike } from "./url-like.ts";
import type { ArrayStrategy, NestedStrategy } from "./types.ts";
import type { InferSchema, Parseable, SchemaMap } from "./schema.ts";

type Pair = [string, string];

function groupByKey(pairs: Pair[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [key, value] of pairs) {
    const values = map.get(key);
    if (values) values.push(value);
    else map.set(key, [value]);
  }
  return map;
}

function parseBracketPath(key: string): string[] {
  const segments = key.match(/^[^[\]]+|\[[^[\]]*\]/g) ?? [key];
  return segments
    .map((segment) => segment.startsWith("[") ? segment.slice(1, -1) : segment)
    .filter((segment) => segment !== "");
}

function assignPath(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
  nested: NestedStrategy,
): void {
  const path = nested === "bracket" ? parseBracketPath(key) : key.split(".");
  let cursor = target;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    const next = cursor[segment];
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      cursor[segment] = {};
    }
    cursor = cursor[segment] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = value;
}

function unflatten(
  pairs: Pair[],
  options: { array: ArrayStrategy; nested: NestedStrategy },
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const grouped = groupByKey(pairs);

  for (const [rawKey, values] of grouped) {
    let key = rawKey;
    let value: unknown = values.length > 1 ? values : values[0];

    if (options.array === "bracket" && key.endsWith("[]")) {
      key = key.slice(0, -2);
      value = values;
    } else if (
      options.array === "comma" && values.length === 1 &&
      values[0].includes(",")
    ) {
      value = values[0].split(",");
    }

    assignPath(result, key, value, options.nested);
  }

  return result;
}

function groupOne(
  grouped: Map<string, string[]>,
  key: string,
  array: ArrayStrategy,
): string | string[] | undefined {
  if (array === "bracket") {
    const bracketValues = grouped.get(`${key}[]`);
    if (bracketValues) return bracketValues;
  }

  const values = grouped.get(key);
  if (!values) return undefined;
  if (values.length > 1) return values;
  if (array === "comma" && values[0].includes(",")) {
    return values[0].split(",");
  }
  return values[0];
}

interface ParseOptions {
  array?: ArrayStrategy;
  nested?: NestedStrategy;
}

interface ParseOptionsWithSchema<S extends SchemaMap> extends ParseOptions {
  schema: S;
}

/**
 * A bare `key=value&key2=value2` string (e.g. `stringify()`'s output) has no
 * leading `?`, `/`, or scheme, so `parseUrlLike` would otherwise treat the
 * whole thing as a relative pathname. Prefixing it with `?` routes it
 * through the search branch instead.
 */
function toSearchInput(input: string | URL): string | URL {
  if (typeof input !== "string" || input === "") return input;
  if (input.startsWith("?") || input.startsWith("/") || input.includes("://")) {
    return input;
  }
  return `?${input}`;
}

/**
 * Parses a URL, bare query string, or `?a=1&b=2` fragment back into an
 * object — the inverse of {@link stringify}. Pass the *same* `array`/
 * `nested` options used to produce the string so duplicate keys, comma
 * lists, and dotted/bracketed paths round-trip correctly.
 *
 * @example
 * ```ts
 * parse("?page=1&tags=a&tags=b");
 * //=> { page: "1", tags: ["a", "b"] }
 * ```
 */
export function parse(
  input: string | URL,
  options?: ParseOptions,
): Record<string, unknown>;
/**
 * Schema-typed variant: each `schema` key maps to a {@link Parseable}
 * (including the built-in `t.*` validators, or a real Zod/Valibot schema),
 * producing a fully typed result.
 *
 * @example
 * ```ts
 * parse("?page=2&tags=js,ts", {
 *   array: "comma",
 *   schema: { page: t.number(), tags: t.array(t.string()) },
 * });
 * //=> { page: 2, tags: ["js", "ts"] }
 * ```
 */
export function parse<S extends SchemaMap>(
  input: string | URL,
  options: ParseOptionsWithSchema<S>,
): InferSchema<S>;
export function parse<S extends SchemaMap>(
  input: string | URL,
  options: ParseOptionsWithSchema<S> | ParseOptions = {},
): Record<string, unknown> | InferSchema<S> {
  const parsed = parseUrlLike(toSearchInput(input));
  const pairs: Pair[] = [...new URLSearchParams(parsed.search).entries()];
  const array = options.array ?? "repeat";
  const nested = options.nested ?? "dot";

  if ("schema" in options) {
    const grouped = groupByKey(pairs);
    const result = {} as Record<string, unknown>;
    for (const key in options.schema) {
      const raw = groupOne(grouped, key, array);
      result[key] = (options.schema[key] as Parseable<unknown>).parse(raw);
    }
    return result as InferSchema<S>;
  }

  return unflatten(pairs, { array, nested });
}
