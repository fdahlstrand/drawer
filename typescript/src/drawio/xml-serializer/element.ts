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
    if (shape.placeholders === undefined || shape.placeholders.size == 0) {
      return Shape.toXmlAsCell(shape);
    } else {
      return Shape.toXmlAsObject(shape);
    }
  }

  static toXmlAsCell(shape: Model.Shape): Xml.MxCell {
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

  static toXmlAsObject(shape: Model.Shape): Xml.MxObject {
    const placeholders =
      shape.placeholders === undefined
        ? {}
        : Object.fromEntries(shape.placeholders);
    const hasPlaceholders = shape.placeholders === undefined ? "0" : "1";

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
  static fromXml(elem: Xml.MxElement): Model.Element {
    if ("mxCell" in elem) {
      return Shape.fromXmlAsCell(elem);
    } else {
      return Shape.fromXmlAsObject(elem);
    }
  }

  static fromXmlAsCell(elem: Xml.MxCell): Model.Element {
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

  static fromXmlAsObject(obj: Xml.MxObject): Model.Element {
    const placeholders = new Map<string, string>();
    Object.keys(obj[":@"])
      .filter((k) => k !== "id" && k !== "label" && k !== "placeholders")
      .reduce((map, k) => map.set(k, obj[":@"][k]), placeholders);

    return {
      kind: "shape",
      identifier: obj[":@"].id,
      label: obj[":@"].label,
      style: Style.parse(obj.object[0][":@"].style),
      position: {
        x: Number(obj.object[0].mxCell[0][":@"].x),
        y: Number(obj.object[0].mxCell[0][":@"].y),
      },
      size: {
        width: Number(obj.object[0].mxCell[0][":@"].width),
        height: Number(obj.object[0].mxCell[0][":@"].height),
      },
      placeholders,
    };
  }
}

export class Connection {
  static toXml(connection: Model.Connection): Xml.MxElement {
    if (
      connection.placeholders === undefined ||
      connection.placeholders.size == 0
    ) {
      return Connection.toXmlAsCell(connection);
    } else {
      return Connection.toXmlAsObject(connection);
    }
  }

  static toXmlAsCell(connection: Model.Connection): Xml.MxCell {
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

  static toXmlAsObject(connection: Model.Connection): Xml.MxObject {
    const placeholders =
      connection.placeholders === undefined
        ? {}
        : Object.fromEntries(connection.placeholders);
    const hasPlaceholders = connection.placeholders === undefined ? "0" : "1";

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
        label: connection.label,
        placeholders: hasPlaceholders,
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
              mxGeometry: [],
            },
          ],
        },
      ],
    };

    if (srcPoint !== undefined) {
      elem.object[0].mxCell[0].mxGeometry.push(srcPoint);
    }

    if (tgtPoint !== undefined) {
      elem.object[0].mxCell[0].mxGeometry.push(tgtPoint);
    }

    if (waypoints !== undefined) {
      elem.object[0].mxCell[0].mxGeometry.push({
        ":@": {
          as: "points",
        },
        Array: waypoints,
      });
    }

    return elem;
  }

  static fromXml(elem: Xml.MxElement): Model.Element {
    if ("mxCell" in elem) {
      return Connection.fromXmlAsCell(elem);
    } else {
      return Connection.fromXmlAsObject(elem);
    }
  }

  static fromXmlAsCell(elem: Xml.MxCell): Model.Connection {
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

  static fromXmlAsObject(elem: Xml.MxObject): Model.Connection {
    const placeholders = new Map<string, string>();
    Object.keys(elem[":@"])
      .filter((k) => k !== "id" && k !== "label" && k !== "placeholders")
      .reduce((map, k) => map.set(k, elem[":@"][k]), placeholders);

    const srcPoint = elem.object[0].mxCell[0].mxGeometry.filter(
      (pt) => pt[":@"].as === "sourcePoint"
    )[0] as Xml.MxPoint;

    const tgtPoint = elem.object[0].mxCell[0].mxGeometry.filter(
      (pt) => pt[":@"].as === "targetPoint"
    )[0] as Xml.MxPoint;

    const array = elem.object[0].mxCell[0].mxGeometry.filter(
      (g) => (g as Xml.MxArray).Array !== undefined
    )[0] as Xml.MxArray;

    const conn: Model.Connection = {
      kind: "connection",
      identifier: elem[":@"].id,
      label: elem[":@"].label,
      style: Style.parse(elem.object[0][":@"].style),
      source: elem.object[0][":@"].source,
      target: elem.object[0][":@"].target,
      placeholders,
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
