export {};
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import * as types from "./types";

export default function convertNodeToRawNodeDatum(
  data: types.Node
): RawNodeDatum {
  return {
    name: data.name,
    attributes: {
      value: data.value,
      valueFormat: data.value_format,
      unit: data.unit,
      isValueLocked: data.is_value_locked,
    },
    children: data.children?.map(convertNodeToRawNodeDatum),
  };
}
