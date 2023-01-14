import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Element } from "./element.js";

export class Diagram {
  static toXml(diagram: Model.Diagram): Xml.Diagram {
    const option = (o: Model.Option) => (o === Model.Option.Yes ? "1" : "0");
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
            shadow: option(diagram.shadows),
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
    const option = (o: "0" | "1") =>
      o === "1" ? Model.Option.Yes : Model.Option.No;
    return {
      identifier: diagram[":@"].id,
      name: diagram[":@"].name,
      elements: diagram.diagram[0].mxGraphModel[0].root
        .filter((e) => e[":@"].id !== "0" && e[":@"].id !== "1")
        .map(Element.fromXml),
      shadows: option(diagram.diagram[0][":@"].shadow),
    };
  }
}
