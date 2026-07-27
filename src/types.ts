/** How a non-empty array value is serialized into the query string. */
export type ArrayStrategy = "repeat" | "comma" | "bracket";

/** How a nested plain object is flattened into query keys. */
export type NestedStrategy = "dot" | "bracket";

/** How a new value interacts with an existing same-key value. */
export type MergeStrategy = "replace" | "append" | "preserve";

/**
 * Shared serialization options used by {@link addParams}, {@link mergeParams},
 * {@link stringify}, and {@link query}.
 */
export interface SerializeOptions {
  /** Array serialization strategy. Default `"repeat"`. */
  array?: ArrayStrategy;
  /** Nested object flattening strategy. Default `"dot"`. */
  nested?: NestedStrategy;
  /** How to combine a value with an existing same-key value. Default `"replace"`. */
  merge?: MergeStrategy;
  /** Throw on values with no serialization rule instead of best-effort `String()`. Default `false`. */
  strict?: boolean;
  /** Sort the final key/value pairs by key for deterministic output. Default `false`. */
  sort?: boolean;
  /** Percent-encode values via `URLSearchParams`. Set `false` for raw, unescaped `key=value` output. Default `true`. */
  encode?: boolean;
  /** Keep `null` values as an empty string instead of omitting the key. Default `false`. */
  keepNull?: boolean;
  /**
   * Produce an AWS SigV4-style canonical query string: forces `sort: true`,
   * strict RFC 3986 encoding, and flat scalar values only (no array/nested
   * shorthand). Default `false`.
   */
  signatureSafe?: boolean;
}
