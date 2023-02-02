import { XMLParser } from "fast-xml-parser";
import * as Model from "../../model.js";
import * as Xml from "../xml.js";
import * as File from "./file.js";

export function deserialize(xml: string): Model.File {
  const parser = new XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    attributeNamePrefix: "",
  });
  const obj = parser.parse(xml) as Xml.MxFile[];

  return File.fromXml(obj[0]);
}
