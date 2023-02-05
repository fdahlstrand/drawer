import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as Style from "./style.js";

export function toXml(shape: Model.Shape): Xml.MxElement {
  if (
    shape.placeholders?.size > 0 ||
    shape?.enablePlaceholders === Model.Yes
  ) {
    return toXmlAsObject(shape);
  } else {
    return toXmlAsCell(shape);
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
          x: shape.position ? shape.position.x : 0,
          y: shape.position ? shape.position.y : 0,
          height: shape.size ? shape.size.height : 120,
          width: shape.size ? shape.size.width : 240,
          as: "geometry",
        },
        mxGeometry: [],
      },
    ],
  };
}

function toXmlAsObject(shape: Model.Shape): Xml.MxObject {
  const placeholders = Object.fromEntries(shape.placeholders ?? []);
  const enablePlaceholders =
    shape.enablePlaceholders === Model.No ? "0" : "1";

  return {
    ":@": {
      id: shape.identifier,
      label: shape.label,
      placeholders: enablePlaceholders,
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
              x: shape.position ? shape.position.x : 0,
              y: shape.position ? shape.position.y : 0,
              height: shape.size ? shape.size.height : 120,
              width: shape.size ? shape.size.width : 240,
              as: "geometry",
            },
            mxGeometry: [],
          },
        ],
      },
    ],
  };
}
