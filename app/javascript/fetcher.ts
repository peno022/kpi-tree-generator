import * as types from "@/types";

export default async function fetcher(url: URL): Promise<types.TreeData> {
  const res = await fetch(url);
  return await res.json();
}
