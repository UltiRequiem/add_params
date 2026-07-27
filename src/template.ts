import { addParams } from "./add-params.ts";
import type { SerializeOptions } from "./types.ts";

/**
 * Builds a path from a `:name` template, substituting each placeholder from
 * `params`, and optionally appends a query string.
 *
 * @throws {TypeError} if a placeholder in `template` has no matching key in `params`.
 *
 * @example
 * ```ts
 * build("/users/:id", { id: 1 });
 * //=> "/users/1"
 *
 * build("/users/:id", { id: 1 }, { query: { page: 2 } });
 * //=> "/users/1?page=2"
 * ```
 */
export function build(
  template: string,
  params: Record<string, string | number>,
  options?: { query?: Record<string, unknown> } & SerializeOptions,
): string {
  const path = template.replace(/:([a-zA-Z0-9_]+)/g, (_match, name: string) => {
    if (!(name in params)) {
      throw new TypeError(`Missing template param: "${name}"`);
    }
    return encodeURIComponent(String(params[name]));
  });

  if (!options?.query) {
    return path;
  }

  return addParams(path, options.query, { ...options, asURL: false });
}
