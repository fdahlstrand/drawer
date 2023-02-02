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

function fromXmlAsCell(elem: Xml.MxCell): Model.Connection {
  const cell = elem.mxCell[0];

  return {
    kind: "connection",
    identifier: elem[":@"].id,
    label: elem[":@"].value,
    style: Style.parse(elem[":@"].style),
    source: elem[":@"].source,
    target: elem[":@"].target,
    sourcePoint: pointFromXmlGeometry(cell.mxGeometry, "sourcePoint"),
    targetPoint: pointFromXmlGeometry(cell.mxGeometry, "targetPoint"),
    waypoints: arrayFromXmlGeometry(cell.mxGeometry),
  };
}

function fromXmlAsObject(obj: Xml.MxObject): Model.Connection {
  const cell = obj.object[0].mxCell[0];

  return {
    kind: "connection",
    identifier: obj[":@"].id,
    label: obj[":@"].label,
    style: Style.parse(obj.object[0][":@"].style),
    source: obj.object[0][":@"].source,
    target: obj.object[0][":@"].target,
    sourcePoint: pointFromXmlGeometry(cell.mxGeometry, "sourcePoint"),
    targetPoint: pointFromXmlGeometry(cell.mxGeometry, "targetPoint"),
    waypoints: arrayFromXmlGeometry(cell.mxGeometry),
    enablePlaceholders: obj[":@"].placeholders === "1" ? Model.Yes : Model.No,
    placeholders: placeholdersFromXml(obj),
  };
}

function pointFromXmlGeometry(
  elem: (Xml.MxPoint | Xml.MxArray)[],
  type?: "sourcePoint" | "targetPoint"
): Model.Point {
  return elem
    .filter((p) => "mxPoint" in p && p[":@"].as === type)
    .map((p) => p as Xml.MxPoint)
    .map(pointFromXml)[0];
}

function arrayFromXmlGeometry(
  elem: (Xml.MxPoint | Xml.MxArray)[]
): Model.Point[] {
  const arr = elem
    .filter((e) => "Array" in e)
    .map((a) => a as Xml.MxArray)[0];

  return arr?.Array.map(pointFromXml);
}

function pointFromXml(pt: Xml.MxPoint): Model.Point {
  return { x: pt[":@"].x, y: pt[":@"].y };
}

function placeholdersFromXml(obj: Xml.MxObject) {
  const placeholders = new Map<string, string>();
  Object.keys(obj[":@"])
    .filter((k) => k !== "id" && k !== "label" && k !== "placeholders")
    .reduce((map, k) => map.set(k, obj[":@"][k]), placeholders);
  return placeholders;
}
