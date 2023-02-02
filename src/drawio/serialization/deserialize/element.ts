import * as Xml from "../xml.js";
import * as Model from "../../model.js";
import * as Shape from "./shape.js";
import * as Connection from "./connection.js";

export function fromXml(elem: Xml.MxElement): Model.Element {
  switch (determineType(elem)) {
    case "shape":
      return Shape.fromXml(elem);
    case "connection":
      return Connection.fromXml(elem);
    default:
      return undefined;
  }
}

function determineType(
  elem: Xml.MxElement
): "shape" | "connection" | undefined {
  const isPropertySet = (p: string) => (p ?? "0") === "1";
  if ("mxCell" in elem) {
    if (isPropertySet(elem[":@"].vertex)) return "shape";
    if (isPropertySet(elem[":@"].edge)) return "connection";
    return undefined;
  } else {
    if (isPropertySet(elem.object[0][":@"].vertex)) return "shape";
    if (isPropertySet(elem.object[0][":@"].edge)) return "connection";
    return undefined;
  }
}
