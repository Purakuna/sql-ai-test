export const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());
