import * as Xml from "../xml.js";
import * as Model from "../../model.js";
import * as Style from "./style.js";

export function fromXml(elem: Xml.MxElement): Model.Element {
  if ("mxCell" in elem) {
    return fromXmlAsCell(elem);
  } else {
    return fromXmlAsObject(elem);
  }
}

function fromXmlAsCell(elem: Xml.MxCell): Model.Element {
  return {
    kind: "shape",
    identifier: elem[":@"].id,
    label: elem[":@"].value,
    style: Style.parse(elem[":@"].style),
    position: elem.mxCell[0]
      ? {
          x: Number(elem.mxCell[0][":@"].x ?? 0),
          y: Number(elem.mxCell[0][":@"].y ?? 0),
        }
      : { x: 0, y: 0 },
    size: elem.mxCell[0]
      ? {
          width: Number(elem.mxCell[0][":@"].width ?? 0),
          height: Number(elem.mxCell[0][":@"].height ?? 0),
        }
      : { width: 0, height: 0 },
  };
}

function fromXmlAsObject(obj: Xml.MxObject): Model.Element {
  const placeholders = getPlaceholdersFromXml(obj);
  const cell = obj.object[0].mxCell[0][":@"];

  return {
    kind: "shape",
    identifier: obj[":@"].id,
    label: obj[":@"].label,
    style: Style.parse(obj.object[0][":@"].style),
    position: {
      x: Number(cell.x ?? 0),
      y: Number(cell.y ?? 0),
    },
    size: {
      width: Number(cell.width),
      height: Number(cell.height),
    },
    enablePlaceholders: obj[":@"].placeholders === "1" ? Model.Yes : Model.No,
    placeholders,
  };
}

function getPlaceholdersFromXml(obj: Xml.MxObject) {
  const placeholders = new Map<string, string>();
  Object.keys(obj[":@"])
    .filter((k) => k !== "id" && k !== "label" && k !== "placeholders")
    .reduce((map, k) => map.set(k, obj[":@"][k]), placeholders);
  return placeholders;
}
