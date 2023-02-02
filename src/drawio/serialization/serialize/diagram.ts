import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as Element from "./element.js";

export function toXml(diagram: Model.Diagram): Xml.Diagram {
  const option = (o: Model.Option) => (o === Model.Yes ? "1" : "0");
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
