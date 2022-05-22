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
 * ```
 */
export function addParams(
  url: string,
  // https://github.com/microsoft/TypeScript/issues/32951#issuecomment-527397109
  parameters: { [key: string]: string | number | boolean },
): string;
export function addParams(
  url: string,
  // https://github.com/microsoft/TypeScript/issues/32951#issuecomment-527397109
  parameters: { [key: string]: string | number | boolean },
  simplify: false,
): URL;
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
