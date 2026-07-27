import { addParams } from "./add-params.ts";
import type { SerializeOptions } from "./types.ts";

/**
 * Merge parameters into an existing URL's query string. Identical to
 * {@link addParams}, exported under its own name for readability when the
 * intent is specifically "merge into what's already there".
 *
 * @example
 * ```ts
 * mergeParams("https://site.com?page=1", { page: 2 });
 * //=> "https://site.com/?page=2"
 *
 * mergeParams("https://site.com?page=1", { page: 2 }, { merge: "preserve" });
 * //=> "https://site.com/?page=1"
 * ```
 */
export function mergeParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options?: SerializeOptions & { asURL?: false },
): string;
export function mergeParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options: SerializeOptions & { asURL: true },
): URL;
export function mergeParams(
  url: string | URL,
  parameters: Record<string, unknown>,
  options: SerializeOptions & { asURL?: boolean } = {},
): string | URL {
  if (options.asURL) {
    return addParams(
      url,
      parameters,
      options as SerializeOptions & { asURL: true },
    );
  }
  return addParams(
    url,
    parameters,
    options as SerializeOptions & { asURL?: false },
  );
}
