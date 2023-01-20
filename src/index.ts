import {
  ArrowStyle,
  Connection,
  Diagram,
  FillStyle,
  GradientDirection,
  No,
  Rectangle,
  Shape,
  XmlSerializer,
  Yes,
} from "./drawio/drawio.js";

import fs from "node:fs";

// TODO: Typing worth looking into to reduce repetetive and error-prone code
// https://www.typescriptlang.org/play?target=7#code/MYewdgzgLgBAwjAvDA3gKBjAGgLhgIgA98AaDGATT3wE9TyAtagL3zQF8YBDCGUSKAG40UGgAcApvCQxRkkADN4AbQDWEmotniJWuAF00InTADKogDYTeyZeWX4upGGACuAWwBGEgE76ymA6ezp4gIFZcYP72+MDOBgEwDgAmzm5evtGB+BJpHt5+iQ4KeRmFMQDmpQVZSfgAFtWZRfgAlk3l2QBWHbUOqr0tFoMx7iPZYON1ICP6wsaSMACyXOoA8p5dEsBQADwAKjAShFASYMm8ytA+rWAVJNxgNPrK+gB8MofHp+eXtwq+GAAMVaPmgRxOZwuSWut3uj2eDwAdCj-oCAErWWDfKGXWF3B6RZ6vfQwAD8qGUAAUYLdgaDoMoAAz6fR4EFgqDKACM+k4ADJlqsJBstjtdpjoB88K4wKowCAAO5geZyKTmGhWGRUrg+KCtLgWXYoam0sAwdSaJQrdabbZ7DVWCBvNlC21ih2Waxval8t5oAD0AbVZi92t1+sNuxtIrt4sd3v9CykKzEkh8BwhP2hVygNwJCJe-hgAFUPsgvpDfkk0T4YABpLO4mD4+FEovkmCY0A+ZK7esPMswPBgCQAN18whDmInYIkqfTmZx1dz+bbTyL5ZglezfzAALrjeX0NbD1rMAAah2KSbVDhW6765wR+PJ0YFLKdq1wDAfK+56mS5Vjmp6Fq8bwABQQD4wB4AuvgHA8rZvAAlHgM6+BA85cGmCH7B86CYH+UCuD45qivaSIKD4IDuAAomAeatNYEHkJgFE7EiZxMSx0HAChSLuDhEEQRIKFIB8ygSDyxbSSy+goeQ4k8F2-5YfBGb4cI7BGCGFBcMkXBAbuMJMQW7bgZ8TYrueHLgseeJmeuiIwCiSLnpK2LAY5a6EhuJKdiaNJ0nZXLyXgEGWngoFjuyDJcry4mIB8rYCpQBlGZ50owLK8pKiqRhoPw4JAnBOGLgmEBIU5W6Edw1AAIL0JgnjUAAQs1fDUHAbA6cVsDojIf6zupwlAopRXgBA4QSEiFggBUMAQeiDhNQphX9S2eAJjIdVcHg3IAEyJK1sg+K4EiJLB8BIlgHBAA

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
        gradientDirection: GradientDirection.Radial,
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
        fillStyle: FillStyle.CrossHatch,
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
      endArrow: ArrowStyle.Classic,
      strokeColor: Colors.Blue,
    }),
  ],
};

const serializer = new XmlSerializer();

const xml = serializer.stringify({ diagrams: [diagram] });
fs.writeFileSync("./dist/generated.drawio", xml, "utf-8");

const input = fs.readFileSync("./dist/test.drawio", "utf-8");
const file = serializer.parse(input);

for (let i = 0; i < file.diagrams[0].elements.length; i++) {
  console.log(file.diagrams[0].elements[i]);
}
