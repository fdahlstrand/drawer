import * as Xml from "./drawio/xml.js";
import * as DrawIO from "./drawio/model.js";

import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";

const diagram: DrawIO.Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  elements: [
    {
      kind: "object",
      identifier: "O1",
      label: "<b>Hello</b>",
      style: {
        rounded: 0,
        html: 1,
        whiteSpace: "wrap",
      },
      position: {
        x: 320,
        y: 160,
      },
      size: {
        width: 120,
        height: 60,
      },
    },
  ],
};

const xml = Xml.toXml([diagram]);
fs.writeFileSync("./dist/generated.drawio", xml, "utf-8");

const input = fs.readFileSync("./dist/test.drawio", "utf-8");

const parsed = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  attributeNamePrefix: "",
}).parse(input) as any;

console.log(JSON.stringify(parsed));
