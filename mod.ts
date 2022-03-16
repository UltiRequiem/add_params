export function addParams(
  url: string,
  params: { [key: string]: string | number },
): string {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${url}?${query}`;
}
