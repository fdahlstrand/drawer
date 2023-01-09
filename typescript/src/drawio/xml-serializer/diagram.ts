import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Element } from "./element.js";

export class Diagram {
  static toXml(diagram: Model.Diagram): Xml.Diagram {
    return {
      ":@": {
        id: diagram.identifier,
        name: diagram.name,
      },
      diagram: [
        {
          ":@": {
            grid: "1",
            gridSize: 10,
            guides: "1",
            tooltips: "1",
            connect: "1",
            arrows: "1",
            fold: "1",
            page: "1",
            pageScale: 1,
            pageWidth: 850,
            pageHeight: 1100,
            math: "1",
            shadow: "1",
          },
          mxGraphModel: [
            {
              root: [
                { mxCell: [], ":@": { id: "0" } },
                { mxCell: [], ":@": { id: "1", parent: "0" } },
                ...diagram.elements.map(Element.toXml),
              ],
            },
          ],
        },
      ],
    };
  }

  static fromXml(diagram: Xml.Diagram): Model.Diagram {
    return {
      identifier: diagram[":@"].id,
      name: diagram[":@"].name,
      elements: diagram.diagram[0].mxGraphModel[0].root
        .filter((e) => e[":@"].id !== "0" && e[":@"].id !== "1")
        .map(Element.fromXml),
    };
  }
}
