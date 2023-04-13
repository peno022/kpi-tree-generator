import { convertNodesToRawNodeDatum } from "./convert_nodes_list_to_tree";
import * as types from "./types";
import fetch from "node-fetch";

async function getTree(): Promise<types.TreeData> {
  const response = await fetch("http://localhost:3000/api/trees/1");
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = (await response.json()) as types.TreeData;
  return data;
}

(async () => {
  try {
    const data = await getTree();

    console.log("=== start sample2 ===");
    const rawNodeDatum = convertNodesToRawNodeDatum(data.nodes, data.layers);
    console.dir(rawNodeDatum, { depth: null });
    console.log("=== end sample2 ===");
  } catch (error) {
    console.error(error);
  }
})();
