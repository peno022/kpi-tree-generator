import { convertNodesToRawNodeDatum } from "./convert_nodes_list_to_raw_node_datum";
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

    console.log("=== start sample ===");
    const rawNodeDatum = convertNodesToRawNodeDatum(data.nodes, data.layers);
    console.dir(rawNodeDatum, { depth: null });
    console.log("=== end sample ===");
  } catch (error) {
    console.error(error);
  }
})();
