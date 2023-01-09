import * as DrawIO from "./drawio/drawio.js";

import fs from "node:fs";

const diagram: DrawIO.Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  elements: [
    {
      kind: "shape",
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

const serializer = new DrawIO.XmlSerializer();

const xml = serializer.stringify({ diagrams: [diagram] });
fs.writeFileSync("./dist/generated.drawio", xml, "utf-8");

const input = fs.readFileSync("./dist/test.drawio", "utf-8");
const file = serializer.parse(input);

console.log(file.diagrams[0].elements[0]);
console.log(file.diagrams[0].elements[1]);
