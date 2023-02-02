import * as Xml from "../xml.js";
import * as Model from "../../model.js";
import * as Diagram from "./diagram.js";
export function fromXml(file: Xml.MxFile): Model.File {
  return {
    diagrams: file.mxfile.map(Diagram.fromXml),
  };
}
