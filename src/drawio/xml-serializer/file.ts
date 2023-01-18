import * as Model from "../model.js";
import * as Xml from "./xml.js";
import { Diagram } from "./diagram.js";

export class File {
  static toXml(file: Model.File): Xml.MxFile {
    return {
      ":@": {
        compressed: false,
        modified: new Date().toISOString(),
      },
      mxfile: file.diagrams.map(Diagram.toXml),
    };
  }

  static fromXml(file: Xml.MxFile): Model.File {
    return {
      diagrams: file.mxfile.map(Diagram.fromXml),
    };
  }
}
