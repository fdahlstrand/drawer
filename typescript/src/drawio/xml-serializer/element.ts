import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Style } from "./style.js";

export class Element {
  static toXml(elem: Model.Element): Xml.MxElement {
    switch (elem.kind) {
      case "shape":
        return Shape.toXml(elem);
      case "connection":
        return Connection.toXml(elem);
      default:
        return undefined;
    }
  }

  private static determineType(
    elem: Xml.MxElement
  ): "shape" | "connection" | undefined {
    const isPropertySet = (p: string) => (p ?? "0") === "1";
    if (isPropertySet(elem[":@"].vertex)) return "shape";
    if (isPropertySet(elem[":@"].edge)) return "connection";

    return undefined;
  }

  static fromXml(elem: Xml.MxElement): Model.Element {
    switch (Element.determineType(elem)) {
      case "shape":
        return Shape.fromXml(elem);
      case "connection":
        return Connection.fromXml(elem);
      default:
        return undefined;
    }
  }
}

export class Shape {
  static toXml(shape: Model.Shape): Xml.MxElement {
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

  static fromXml(elem: Xml.MxElement): Model.Element {
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
}

export class Connection {
  static toXml(connection: Model.Connection): Xml.MxElement {
    const srcPoint: Xml.MxPoint =
      connection.sourcePoint !== undefined
        ? {
            ":@": {
              as: "sourcePoint",
              x: connection.sourcePoint.x,
              y: connection.sourcePoint.y,
            },
            mxPoint: [],
          }
        : undefined;

    const tgtPoint: Xml.MxPoint =
      connection.targetPoint !== undefined
        ? {
            ":@": {
              as: "targetPoint",
              x: connection.targetPoint.x,
              y: connection.targetPoint.y,
            },
            mxPoint: [],
          }
        : undefined;

    const waypoints: Xml.MxPoint[] =
      connection.waypoints !== undefined
        ? connection.waypoints.map((p) => ({
            ":@": { x: p.x, y: p.y },
            mxPoint: [],
          }))
        : undefined;

    const elem: Xml.MxElement = {
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
          mxGeometry: [],
        },
      ],
    };

    if (srcPoint !== undefined) {
      elem.mxCell[0].mxGeometry.push(srcPoint);
    }

    if (tgtPoint !== undefined) {
      elem.mxCell[0].mxGeometry.push(tgtPoint);
    }

    if (waypoints !== undefined) {
      elem.mxCell[0].mxGeometry.push({
        ":@": {
          as: "points",
        },
        Array: waypoints,
      });
    }

    return elem;
  }

  static fromXml(elem: Xml.MxElement): Model.Connection {
    const srcPoint = elem.mxCell[0].mxGeometry.filter(
      (pt) => pt[":@"].as === "sourcePoint"
    )[0] as Xml.MxPoint;
    const tgtPoint = elem.mxCell[0].mxGeometry.filter(
      (pt) => pt[":@"].as === "targetPoint"
    )[0] as Xml.MxPoint;
    const array = elem.mxCell[0].mxGeometry.filter(
      (g) => (g as Xml.MxArray).Array !== undefined
    )[0] as Xml.MxArray;
    const conn: Model.Connection = {
      kind: "connection",
      identifier: elem[":@"].id,
      label: elem[":@"].value,
      style: Style.parse(elem[":@"].style),
      source: elem[":@"].source,
      target: elem[":@"].target,
    };

    if (srcPoint !== undefined) {
      conn.sourcePoint = {
        x: srcPoint[":@"].x,
        y: srcPoint[":@"].y,
      };
    }

    if (tgtPoint !== undefined) {
      conn.targetPoint = {
        x: tgtPoint[":@"].x,
        y: tgtPoint[":@"].y,
      };
    }

    if (array !== undefined) {
      conn.waypoints = array.Array.map((p) => ({
        x: p[":@"].x,
        y: p[":@"].y,
      }));
    }

    return conn;
  }
}
