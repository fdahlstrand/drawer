import * as Model from "../model.js";
import * as Xml from "./xml.js";

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
        style: Model.Style.toString(shape.style),
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
      style: Model.Style.fromString(elem[":@"].style),
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
    return {
      ":@": {
        id: connection.identifier,
        parent: "1",
        value: connection.label,
        edge: "1",
        source: connection.source,
        target: connection.target,
        style: Model.Style.toString(connection.style),
      },
      mxCell: [],
    };
  }

  static fromXml(elem: Xml.MxElement): Model.Connection {
    return {
      kind: "connection",
      identifier: elem[":@"].id,
      label: elem[":@"].value,
      style: Model.Style.fromString(elem[":@"].style),
      source: elem[":@"].source,
      target: elem[":@"].target,
    };
  }
}
