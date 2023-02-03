import { fromXml } from "../diagram.js";
import { Diagram } from "../../xml.js";

describe("deserialization of a diagram", () => {
  it("sets the identifier of the diagram", () => {
    const id = "testId";
    const model = fromXml({
      ...defaultXml,
      ":@": { ...defaultXml[":@"], id },
    });
    expect(model.identifier).toBe(id);
  });

  it("sets the name of the diagram", () => {
    const name = "testName";
    const model = fromXml({
      ...defaultXml,
      ":@": { ...defaultXml[":@"], name },
    });
    expect(model.name).toBe(name);
  });

  it("does not deserialize root and background layer elements", () => {
    const model = fromXml(defaultXml);
    expect(model.elements.length).toBe(0);
  });

  it("deserializes the elements (apart from root and backrground layer)", () => {
    const mode = fromXml({
      ...defaultXml,
      diagram: [
        {
          ...defaultXml.diagram[0],
          mxGraphModel: [
            {
              ...defaultXml.diagram[0].mxGraphModel[0],
              root: [
                ...defaultXml.diagram[0].mxGraphModel[0].root,
                {
                  ":@": {
                    id: "<not used>",
                    vertex: "1",
                  },
                  mxCell: [],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(mode.elements.length).toBe(1);
  });
});

const defaultXml: Diagram = {
  ":@": {
    id: "<not used>",
    name: "<not used>",
  },
  diagram: [
    {
      ":@": {},
      mxGraphModel: [
        {
          root: [
            {
              ":@": {
                id: "0",
              },
              mxCell: [],
            },
            {
              ":@": {
                id: "1",
                parent: "0",
              },
              mxCell: [],
            },
          ],
        },
      ],
    },
  ],
};
