import * as DrawIO from "./drawio/drawio.js";

import fs from "node:fs";

const diagram: DrawIO.Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  shadows: DrawIO.No,
  elements: [
    new DrawIO.ShapeBuilder("O1")
      .withLabel("<i>Hello: %foo%</i>")
      .withStyle({
        rounded: DrawIO.Yes,
        html: DrawIO.Yes,
        whiteSpace: "wrap",
      })
      .atPosition(320, 160)
      .withSize(120, 60)
      .withPlaceholder("foo", 12)
      .usePlaceholders()
      .build(),
    new DrawIO.ShapeBuilder("O2")
      .withLabel("<b>Hello: %foo%</b>")
      .withStyle({
        rounded: DrawIO.No,
        html: DrawIO.Yes,
        whiteSpace: "wrap",
      })
      .atPosition(320, 320)
      .withSize(120, 60)
      .withPlaceholder("foo", 2 * 12)
      .usePlaceholders()
      .build(),
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
