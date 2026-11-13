/** Resolve public assets against the same base path as Vite's JS and CSS bundles. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
