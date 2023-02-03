import * as Xml from "../xml.js";
import * as Model from "../../model.js";
import * as Element from "./element.js";

export function fromXml(diagram: Xml.Diagram): Model.Diagram {
  const option = (o: "0" | "1") => (o === "1" ? Model.Yes : Model.No);
  const contents = diagram.diagram[0];
  return {
    identifier: diagram[":@"].id,
    name: diagram[":@"].name,
    elements: (contents ? contents.mxGraphModel[0].root : [])
      .filter((e) => e[":@"].id !== "0" && e[":@"].id !== "1")
      .map(Element.fromXml),
    shadows: contents ? option(contents[":@"].shadow) : Model.No,
  };
}
