export default function fetcher(url: URL): Promise<any> {
  return fetch(url).then((res) => res.json());
}
