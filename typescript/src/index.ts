import * as DrawIO from "./drawio/drawio.js";

import fs from "node:fs";

const Yes = DrawIO.Option.Yes;
const No = DrawIO.Option.No;

const diagram: DrawIO.Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  shadows: No,
  elements: [
    {
      kind: "shape",
      identifier: "O1",
      label: "<b>Hello: %foo%</b>",
      style: {
        rounded: No,
        html: Yes,
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
      enablePlaceholders: Yes,
      placeholders: new Map(
        Object.entries({
          foo: "12",
        })
      ),
    },
    {
      kind: "shape",
      identifier: "O2",
      label: "<b>Hello: %foo%</b>",
      style: {
        rounded: No,
        html: Yes,
        whiteSpace: "wrap",
      },
      position: {
        x: 320,
        y: 320,
      },
      size: {
        width: 120,
        height: 60,
      },
      enablePlaceholders: Yes,
      placeholders: new Map(
        Object.entries({
          foo: "24",
        })
      ),
    },
    {
      kind: "connection",
      identifier: "R1",
      label: "A connection",
      style: {
        endArrow: DrawIO.ArrowStyle.Classic,
      },
      source: "O1",
      target: "O2",
    },
  ],
};

const serializer = new DrawIO.XmlSerializer();

const xml = serializer.stringify({ diagrams: [diagram] });
fs.writeFileSync("./dist/generated.drawio", xml, "utf-8");

const input = fs.readFileSync("./dist/test.drawio", "utf-8");
const file = serializer.parse(input);

for (let i = 0; i < file.diagrams[0].elements.length; i++) {
  console.log(file.diagrams[0].elements[i]);
}
