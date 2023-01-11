import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Style } from "./style.js";

export class Shape {
  static toXml(shape: Model.Shape): Xml.MxElement {
    if (shape.placeholders === undefined || shape.placeholders.size == 0) {
      return toXmlAsCell(shape);
    } else {
      return toXmlAsObject(shape);
    }
  }

  static fromXml(elem: Xml.MxElement): Model.Element {
    if ("mxCell" in elem) {
      return fromXmlAsCell(elem);
    } else {
      return fromXmlAsObject(elem);
    }
  }
}

function toXmlAsCell(shape: Model.Shape): Xml.MxCell {
  return {
    ":@": {
      id: shape.identifier,
      parent: "1",
      value: shape.label,
      style: Style.stringify(shape.style),
      vertex: "1",
    },
    mxCell: [
      {
        ":@": {
          x: shape.position.x,
          y: shape.position.y,
          height: shape.size.height,
          width: shape.size.width,
          as: "geometry",
        },
        mxGeometry: [],
      },
    ],
  };
}

function toXmlAsObject(shape: Model.Shape): Xml.MxObject {
  const placeholders = Object.fromEntries(shape.placeholders ?? []);
  const hasPlaceholders = shape.placeholders ? "0" : "1";

  return {
    ":@": {
      id: shape.identifier,
      label: shape.label,
      placeholders: hasPlaceholders,
      ...placeholders,
    },
    object: [
      {
        ":@": {
          parent: "1",
          style: Style.stringify(shape.style),
          vertex: "1",
        },
        mxCell: [
          {
            ":@": {
              x: shape.position.x,
              y: shape.position.y,
              height: shape.size.height,
              width: shape.size.width,
              as: "geometry",
            },
            mxGeometry: [],
          },
        ],
      },
    ],
  };
}

function fromXmlAsCell(elem: Xml.MxCell): Model.Element {
  return {
    kind: "shape",
    identifier: elem[":@"].id,
    label: elem[":@"].value,
    style: Style.parse(elem[":@"].style),
    position: {
      x: Number(elem.mxCell[0][":@"].x),
      y: Number(elem.mxCell[0][":@"].y),
    },
    size: {
      width: Number(elem.mxCell[0][":@"].width),
      height: Number(elem.mxCell[0][":@"].height),
    },
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
      x: Number(cell.x),
      y: Number(cell.y),
    },
    size: {
      width: Number(cell.width),
      height: Number(cell.height),
    },
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
