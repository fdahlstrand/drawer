import {
  ArrowClassic,
  Connection,
  Diagram,
  FillCrossHatch,
  No,
  Radial,
  Rectangle,
  Shape,
  Serializer,
  Yes,
} from "./drawio/drawio.js";

import fs from "node:fs";

const Colors = {
  Red: "#FF0000",
  Green: "#00FF00",
  Blue: "#0000FF",
  None: "none",
} as const;

const diagram: Diagram = {
  identifier: "P1",
  name: "Page-Foo",
  shadows: No,
  elements: [
    Rectangle("O1")
      .withLabel("<i>Hello: %foo%</i>")
      .withStyle({
        rounded: Yes,
        html: Yes,
        whiteSpace: "wrap",
        fillColor: "#009900",
        gradientColor: Colors.Green,
        gradientDirection: Radial,
        strokeColor: Colors.Green,
        dashed: Yes,
        dashPattern: [5, 2, 1, 2],
        perimeterSpacing: 12,
      })
      .atPosition(320, 160)
      .withPlaceholder("foo", 12)
      .usePlaceholders(),
    Rectangle("O2")
      .withLabel("<b>Hello: %foo%</b>")
      .withStyle({
        rounded: No,
        html: Yes,
        whiteSpace: "wrap",
        fillColor: Colors.Blue,
        fillStyle: FillCrossHatch,
        strokeColor: Colors.None,
        opacity: 25,
      })
      .atPosition(320, 320)
      .withPlaceholder("foo", 2 * 12)
      .usePlaceholders(),
    Shape("A1")
      .withLabel("Yada")
      .withStyle({
        shape: "umlActor",
      })
      .atPosition(100, 100)
      .withSize(30, 60),
    Connection("R1", "O1", "O2").withLabel("A connection").withStyle({
      endArrow: ArrowClassic,
      strokeColor: Colors.Blue,
    }),
  ],
};

const xml = Serializer.serialize({ diagrams: [diagram] });
fs.writeFileSync("./dist/generated.drawio", xml, "utf-8");

const input = fs.readFileSync("./dist/test.drawio", "utf-8");
const file = Serializer.deserialize(input);

for (let i = 0; i < file.diagrams[0].elements.length; i++) {
  console.log(file.diagrams[0].elements[i]);
}
