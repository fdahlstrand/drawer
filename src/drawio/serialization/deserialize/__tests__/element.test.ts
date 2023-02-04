import { MxCell, MxObject } from "../../xml.js";
import { fromXml } from "../element.js";

describe("deserialization of an element", () => {
  it("deserializes a vertex cell to a shape", () => {
    const model = fromXml({
      ":@": {
        vertex: "1",
      },
      mxCell: [],
    } as MxCell);

    expect(model.kind).toBe("shape");
  });

  it("deserializes an edge cell to a connection", () => {
    const model = fromXml({
      ":@": {
        edge: "1",
      },
      mxCell: [{}],
    } as MxCell);

    expect(model.kind).toBe("connection");
  });

  it("deserializes cells without edge or vertex set to undefined", () => {
    const model = fromXml({
      ":@": {},
      mxCell: [{}],
    } as MxCell);

    expect(model).toBeUndefined();
  });

  it("deserializes a vertex object to a shape", () => {
    const model = fromXml({
      ":@": {},
      object: [
        {
          ":@": {
            vertex: "1",
          },
          mxCell: [
            {
              ":@": {},
            },
          ],
        },
      ],
    } as MxObject);

    expect(model.kind).toBe("shape");
  });

  it("deserializes an edge object to a connection", () => {
    const model = fromXml({
      ":@": {},
      object: [
        {
          ":@": {
            edge: "1",
          },
          mxCell: [
            {
              ":@": {},
            },
          ],
        },
      ],
    } as MxObject);

    expect(model.kind).toBe("connection");
  });

  it("deserializes object without edge or vertex set to undefined", () => {
    const model = fromXml({
      object: [
        {
          ":@": {},
        },
      ],
    } as MxObject);

    expect(model).toBeUndefined();
  });
});
