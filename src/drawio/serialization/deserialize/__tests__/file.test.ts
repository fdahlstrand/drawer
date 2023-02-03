import { fromXml } from "../file.js";

describe("deserialization of mxfile XML element", () => {
  it("return no diagrams for an empty element", () => {
    const model = fromXml({
      ":@": { compressed: false, modified: "" },
      mxfile: [],
    });
    expect(model.diagrams.length).toBe(0);
  });

  it("returns all contained diagrams", () => {
    const model = fromXml({
      ":@": { compressed: false, modified: "" },
      mxfile: [
        {
          ":@": {
            id: "A",
            name: "A",
          },
          diagram: [],
        },

        {
          ":@": {
            id: "B",
            name: "B",
          },
          diagram: [],
        },
      ],
    });
    expect(model.diagrams.length).toBe(2);
  });
});
