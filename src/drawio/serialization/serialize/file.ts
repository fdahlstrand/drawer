import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as Diagram from "./diagram.js";

export function toXml(file: Model.File): Xml.MxFile {
  return {
    ":@": {
      compressed: false,
      modified: new Date().toISOString(),
    },
    mxfile: file.diagrams.map(Diagram.toXml),
  };
}
