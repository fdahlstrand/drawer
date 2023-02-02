import { XMLBuilder } from "fast-xml-parser";
import * as Model from "../../model.js";
import * as File from "./file.js";

export function serialize(file: Model.File): string {
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
