import type {
  ArrayStrategy,
  MergeStrategy,
  NestedStrategy,
  SerializeOptions,
} from "./types.ts";

type Pair = [string, string];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function stringifyScalar(
  value: unknown,
  key: string,
  strict: boolean,
): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number" || typeof value === "string") {
    return String(value);
  }
  if (strict) {
    throw new TypeError(
      `Cannot serialize a non-scalar array element for key "${key}".`,
    );
  }
  return String(value);
}

interface FlattenOptions {
  array: ArrayStrategy;
  nested: NestedStrategy;
  strict: boolean;
  keepNull: boolean;
  signatureSafe: boolean;
}

function flattenValue(
  key: string,
  value: unknown,
  opts: FlattenOptions,
  out: Pair[],
): void {
  if (value === undefined) return;

  if (value === null) {
    if (opts.keepNull) out.push([key, ""]);
    return;
  }

  if (typeof value === "boolean") {
    out.push([key, value ? "true" : "false"]);
    return;
  }

  if (typeof value === "number" || typeof value === "string") {
    out.push([key, String(value)]);
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return;
    if (opts.signatureSafe) {
      throw new TypeError(
        `signatureSafe mode requires flat scalar values; "${key}" is an array.`,
      );
    }
    if (opts.array === "comma") {
      out.push([
        key,
        value.map((item) => stringifyScalar(item, key, opts.strict)).join(
          ",",
        ),
      ]);
    } else if (opts.array === "bracket") {
      for (const item of value) {
        out.push([`${key}[]`, stringifyScalar(item, key, opts.strict)]);
      }
    } else {
      for (const item of value) {
        out.push([key, stringifyScalar(item, key, opts.strict)]);
      }
    }
    return;
  }

  if (isPlainObject(value)) {
    if (opts.signatureSafe) {
      throw new TypeError(
        `signatureSafe mode requires flat scalar values; "${key}" is an object.`,
      );
    }
    for (const [childKey, childValue] of Object.entries(value)) {
      const nextKey = opts.nested === "bracket"
        ? `${key}[${childKey}]`
        : `${key}.${childKey}`;
      flattenValue(nextKey, childValue, opts, out);
    }
    return;
  }

  if (opts.strict) {
    throw new TypeError(
      `Cannot serialize a value of type "${typeof value}" for key "${key}"; enable a supported type or disable strict mode.`,
    );
  }
  out.push([key, String(value)]);
}

/** Flattens an input object into ordered `[key, value]` pairs per `options`. */
export function flatten(
  input: Record<string, unknown>,
  options: SerializeOptions = {},
): Pair[] {
  const opts: FlattenOptions = {
    array: options.array ?? "repeat",
    nested: options.nested ?? "dot",
    strict: options.strict ?? false,
    keepNull: options.keepNull ?? false,
    signatureSafe: options.signatureSafe ?? false,
  };

  const out: Pair[] = [];
  for (const [key, value] of Object.entries(input)) {
    flattenValue(key, value, opts, out);
  }
  return out;
}

function mergePairs(
  existing: Pair[],
  incoming: Pair[],
  merge: MergeStrategy,
): Pair[] {
  if (merge === "append") {
    return [...existing, ...incoming];
  }

  if (merge === "preserve") {
    const existingKeys = new Set(existing.map(([key]) => key));
    const filteredIncoming = incoming.filter(([key]) => !existingKeys.has(key));
    return [...existing, ...filteredIncoming];
  }

  // "replace": drop every existing entry whose key is being set, keep incoming's order.
  const incomingKeys = new Set(incoming.map(([key]) => key));
  const filteredExisting = existing.filter(([key]) => !incomingKeys.has(key));
  return [...filteredExisting, ...incoming];
}

/** Combines an existing (already-decoded) pair list with new pairs per `merge`. */
export function combine(
  existing: Pair[],
  incoming: Pair[],
  merge: MergeStrategy = "replace",
): Pair[] {
  return mergePairs(existing, incoming, merge);
}

function encodeComponent(value: string): string {
  // Commas are valid unencoded in a query component (RFC 3986 sub-delims)
  // and are our own array/comma-mode delimiter — leave them readable.
  return encodeURIComponent(value).replace(/%2C/g, ",");
}

function canonicalEncodeComponent(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** Serializes ordered pairs into a query string per `sort`/`encode`/`signatureSafe`. */
export function serializePairs(
  pairs: Pair[],
  options: Pick<SerializeOptions, "sort" | "encode" | "signatureSafe"> = {},
): string {
  const sort = options.sort ?? false;
  const encode = options.encode ?? true;
  const signatureSafe = options.signatureSafe ?? false;

  const ordered = sort || signatureSafe
    ? [...pairs].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    : pairs;

  const encoder = signatureSafe
    ? canonicalEncodeComponent
    : encode
    ? encodeComponent
    : (value: string) => value;

  return ordered.map(([key, value]) => `${encoder(key)}=${encoder(value)}`)
    .join("&");
}

/** Decodes a raw (already-URL-decoded via `URLSearchParams`) search string into ordered pairs. */
export function decodePairs(search: string): Pair[] {
  return [...new URLSearchParams(search).entries()];
}
