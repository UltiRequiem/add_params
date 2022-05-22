/**
 * This module is browser compatible.
 *
 * Add Query Parameters
 *
 * https://github.com/UltiRequiem/add_params
 *
 * https://ulti.js.org/add_params
 *
 * Copyright (c) Eliaz Bobadilla.
 *
 * Released under the MIT License.
 *
 * @module
 */

/**
 * Add Query Parameters to an URL.
 *
 * Query String: {@link https://wikipedia.org/wiki/Query_string}
 *
 * @param url - The URL to which to add query parameters.
 * @param parameters - The Parameters to add.
 *
 * @returns The result of adding the parameters to the base URL.
 *
 * @example
 * ```javascript
 * addParams("https://ultirequiem.com", { hello: "world", author: "Eliaz" });
 * //=> https://ultirequiem.com/?hello=world&author=Eliaz
 *
 *  addParams("https://ulti.js.org", { page: 33, author: "Me", share: false });
 * //=> https://ulti.js.org/?page=33&author=Me&share=false
 * ```
 */
export function addParams(
  url: string,
  parameters: { [key: string]: string | number | boolean },
): string;
export function addParams(
  url: string,
  parameters: { [key: string]: string | number | boolean },
  simplify: false,
): URL;
export function addParams(
  url: string,
  parameters: { [key: string]: string | number | boolean },
  simplify: true,
): string;
export function addParams(
  url: string,
  // https://github.com/microsoft/TypeScript/issues/32951#issuecomment-527397109
  parameters: { [key: string]: string | number | boolean },
  simplify = true,
) {
  const parsedURL = new URL(url);

  for (const key in parameters) {
    parsedURL.searchParams.append(key, parameters[key] as string);
  }

  return simplify ? parsedURL.toString() : parsedURL;
}
