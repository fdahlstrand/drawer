import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as Shape from "./shape.js";
import * as Connection from "./connection.js";

export function toXml(
  elem: Model.Element | Model.ElementBuilder
): Xml.MxElement {
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
    return toXml(elem.build());
  }
}

function isElement(
  obj: Model.Element | Model.ElementBuilder
): obj is Model.Element {
  return "kind" in obj;
}
