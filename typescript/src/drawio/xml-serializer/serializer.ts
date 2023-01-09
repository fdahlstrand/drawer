import { XMLBuilder, XMLParser } from "fast-xml-parser";
import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { File } from "./file.js";

export class XmlSerializer {
  stringify(file: Model.File): string {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      preserveOrder: true,
      attributeNamePrefix: "",
      suppressEmptyNode: true,
      format: true,
    });

    const obj = [File.toXml(file)];
    const xml: string = builder.build(obj);

    return xml.trimStart();
  }

  parse(xml: string): Model.File {
    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: true,
      attributeNamePrefix: "",
    });
    const obj = parser.parse(xml) as Xml.MxFile[];

    return File.fromXml(obj[0]);
  }
}
