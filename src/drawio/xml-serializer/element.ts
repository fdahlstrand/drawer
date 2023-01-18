import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Shape } from "./shape.js";
import { Connection } from "./connection.js";

export class Element {
  static toXml(elem: Model.Element | Model.ElementBuilder): Xml.MxElement {
    if (isElement(elem)) {
      switch (elem.kind) {
        case "shape":
          return Shape.toXml(elem);
        case "connection":
          return Connection.toXml(elem);
        default:
          return undefined;
      }
    } else {
      return Element.toXml(elem.build());
    }
  }

  static fromXml(elem: Xml.MxElement): Model.Element {
    switch (determineType(elem)) {
      case "shape":
        return Shape.fromXml(elem);
      case "connection":
        return Connection.fromXml(elem);
      default:
        return undefined;
    }
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

function isElement(
  obj: Model.Element | Model.ElementBuilder
): obj is Model.Element {
  return "kind" in obj;
}
