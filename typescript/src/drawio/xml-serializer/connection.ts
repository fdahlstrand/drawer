import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Style } from "./style.js";

export class Connection {
  static toXml(connection: Model.Connection): Xml.MxElement {
    if (
      connection.placeholders?.size > 0 ||
      connection?.enablePlaceholders === Model.Option.Yes
    ) {
      return toXmlAsObject(connection);
    } else {
      return toXmlAsCell(connection);
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

function toXmlAsCell(connection: Model.Connection): Xml.MxCell {
  const srcPoint = toXmlPoint(connection.sourcePoint, "sourcePoint");
  const tgtPoint = toXmlPoint(connection.targetPoint, "targetPoint");
  const waypoints = toXmlPointList(connection.waypoints);

  return {
    ":@": {
      id: connection.identifier,
      parent: "1",
      value: connection.label,
      edge: "1",
      source: connection.source,
      target: connection.target,
      style: Style.stringify(connection.style),
    },
    mxCell: [
      {
        ":@": {
          as: "geometry",
        },
        mxGeometry: [
          ...(srcPoint ? [srcPoint] : []),
          ...(tgtPoint ? [tgtPoint] : []),
          ...(waypoints ? [waypoints] : []),
        ],
      },
    ],
  };
}

function toXmlAsObject(connection: Model.Connection): Xml.MxObject {
  const placeholders = Object.fromEntries(connection.placeholders ?? []);
  const enablePlaceholders =
    connection.enablePlaceholders === Model.Option.No ? "0" : "1";
  const srcPoint = toXmlPoint(connection.sourcePoint, "sourcePoint");
  const tgtPoint = toXmlPoint(connection.targetPoint, "targetPoint");
  const waypoints = toXmlPointList(connection.waypoints);

  return {
    ":@": {
      id: connection.identifier,
      label: connection.label,
      placeholders: enablePlaceholders,
      ...placeholders,
    },
    object: [
      {
        ":@": {
          parent: "1",
          edge: "1",
          source: connection.source,
          target: connection.target,
          style: Style.stringify(connection.style),
        },
        mxCell: [
          {
            ":@": {
              as: "geometry",
            },
            mxGeometry: [
              ...(srcPoint && [srcPoint]),
              ...(tgtPoint && [tgtPoint]),
              ...(waypoints && [waypoints]),
            ],
          },
        ],
      },
    ],
  };
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
    enablePlaceholders:
      obj[":@"].placeholders === "1" ? Model.Option.Yes : Model.Option.No,
    placeholders: placeholdersFromXml(obj),
  };
}

function toXmlPointList(pts: Model.Point[]): Xml.MxArray {
  return pts?.length > 0
    ? {
        ":@": {
          as: "points",
        },
        Array: pts.map((p) => toXmlPoint(p)),
      }
    : undefined;
}

function toXmlPoint(
  pt: Model.Point,
  type?: "targetPoint" | "sourcePoint"
): Xml.MxPoint {
  return pt
    ? {
        ":@": {
          as: type,
          x: pt.x,
          y: pt.y,
        },
        mxPoint: [],
      }
    : undefined;
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
