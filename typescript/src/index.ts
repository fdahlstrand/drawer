import * as DrawIO from "./drawio/drawio.js";

import fs from "node:fs";

const Colors = {
  Red: "#FF0000",
  Green: "#00FF00",
  Blue: "#0000FF",
  None: "none",
} as const;

const Yes = DrawIO.Yes;
const No = DrawIO.No;

const diagram: DrawIO.Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  shadows: DrawIO.No,
  elements: [
    DrawIO.Rectangle("O1")
      .withLabel("<i>Hello: %foo%</i>")
      .withStyle({
        rounded: Yes,
        html: Yes,
        whiteSpace: "wrap",
        fillColor: Colors.None,
        strokeColor: Colors.Green,
        dashed: Yes,
        dashPattern: [5, 2, 1, 2],
        perimeterSpacing: 12,
      })
      .atPosition(320, 160)
      .withPlaceholder("foo", 12)
      .usePlaceholders(),
    DrawIO.Rectangle("O2")
      .withLabel("<b>Hello: %foo%</b>")
      .withStyle({
        rounded: No,
        html: Yes,
        whiteSpace: "wrap",
        fillColor: Colors.Blue,
        strokeColor: Colors.None,
        opacity: 25,
      })
      .atPosition(320, 320)
      .withPlaceholder("foo", 2 * 12)
      .usePlaceholders(),
    DrawIO.Connection("R1", "O1", "O2").withLabel("A connection").withStyle({
      endArrow: DrawIO.ArrowStyle.Classic,
      strokeColor: Colors.Blue,
    }),
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
