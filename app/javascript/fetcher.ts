import * as types from "@/types";

export default async function fetcher(
  url: URL
): Promise<types.TreeDataFromApi> {
  const res = await fetch(url);
  return await res.json();
}
