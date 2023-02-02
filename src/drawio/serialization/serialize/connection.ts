import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as Style from "./style.js";

export function toXml(connection: Model.Connection): Xml.MxElement {
  if (
    connection.placeholders?.size > 0 ||
    connection?.enablePlaceholders === Model.Yes
  ) {
    return toXmlAsObject(connection);
  } else {
    return toXmlAsCell(connection);
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
    connection.enablePlaceholders === Model.No ? "0" : "1";
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
