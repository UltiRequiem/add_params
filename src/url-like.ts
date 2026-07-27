/**
 * A URL broken into reassembly-friendly pieces. Works for both absolute
 * URLs (parsed via the `URL` constructor) and bare relative paths/query
 * strings (parsed manually, since `URL` requires an origin).
 */
export interface UrlLike {
  /** Whether the input was a valid absolute URL. */
  absolute: boolean;
  /** `protocol://host` (no trailing slash) for absolute input; `""` for relative input. */
  prefix: string;
  /** Path portion, e.g. `/api`. */
  pathname: string;
  /** Query string without the leading `?`. */
  search: string;
  /** Fragment without the leading `#`. */
  hash: string;
}

/** Parses a `string | URL` into its reassembly pieces, absolute or relative. */
export function parseUrlLike(url: string | URL): UrlLike {
  const input = url.toString();

  try {
    const parsed = new URL(input);
    return {
      absolute: true,
      prefix: parsed.origin,
      pathname: parsed.pathname,
      search: parsed.search.slice(1),
      hash: parsed.hash.slice(1),
    };
  } catch {
    const hashIndex = input.indexOf("#");
    const hash = hashIndex === -1 ? "" : input.slice(hashIndex + 1);
    const withoutHash = hashIndex === -1 ? input : input.slice(0, hashIndex);

    const queryIndex = withoutHash.indexOf("?");
    const search = queryIndex === -1 ? "" : withoutHash.slice(queryIndex + 1);
    const pathname = queryIndex === -1
      ? withoutHash
      : withoutHash.slice(0, queryIndex);

    return { absolute: false, prefix: "", pathname, search, hash };
  }
}

/**
 * Rebuilds a `UrlLike` with a new (already-serialized) search string.
 *
 * @throws {TypeError} if `asURL` is requested for a relative (non-absolute) input.
 */
export function reassemble(
  parsed: UrlLike,
  search: string,
  asURL: boolean,
): string | URL {
  const searchPart = search ? `?${search}` : "";
  const hashPart = parsed.hash ? `#${parsed.hash}` : "";
  const result = `${parsed.prefix}${parsed.pathname}${searchPart}${hashPart}`;

  if (!asURL) {
    return result;
  }

  if (!parsed.absolute) {
    throw new TypeError(
      "Cannot return a URL instance for a relative input; pass an absolute URL or omit `asURL`.",
    );
  }

  return new URL(result);
}
