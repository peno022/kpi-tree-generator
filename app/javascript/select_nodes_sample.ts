import { convertNodesToRawNodeDatum } from "./convert_nodes_list_to_raw_node_datum";
import * as types from "./types";
import fetch from "node-fetch";
import { selectNodes } from "./select_nodes";

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

    const rawNodeDatum = convertNodesToRawNodeDatum(data.nodes, data.layers);
    console.dir(rawNodeDatum, { depth: null });
    console.log("============");
    const afterSelected = selectNodes(1, rawNodeDatum);
    console.dir(afterSelected, { depth: null });
  } catch (error) {
    console.error(error);
  }
})();
