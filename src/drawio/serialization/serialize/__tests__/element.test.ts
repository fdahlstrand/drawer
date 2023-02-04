import { toXml } from "../element.js";
import * as Model from "../../../model.js";

describe("serialization of an element", () => {
  it("serializes to a vertex cell for a shape", () => {
    const xml = toXml({
      kind: "shape",
    } as Model.Shape);
    expect(xml[":@"].vertex).toBe("1");
  });

  it("serializes to an edge cell for a connection", () => {
    const xml = toXml({
      kind: "connection",
    } as Model.Connection);
    expect(xml[":@"].edge).toBe("1");
  });

  it("serializes to undefined for an unsupported type", () => {
    const xml = toXml({
      kind: "<not supported>",
    } as unknown as Model.Element);
    expect(xml).toBeUndefined();
  });

  it("serializes to a vertex cell for a shape builder", () => {
    const xml = toXml(new TestShapeBuilder());
    expect(xml[":@"].vertex).toBe("1");
  });

  it("serializes to an edge cell for a connection builder", () => {
    const xml = toXml(new TestConnectionBuilder());
    expect(xml[":@"].edge).toBe("1");
  });
});

class TestShapeBuilder implements Model.ElementBuilder {
  build(): Model.Element {
    return { kind: "shape" } as Model.Shape;
  }
}

class TestConnectionBuilder implements Model.ElementBuilder {
  build(): Model.Element {
    return { kind: "connection" } as Model.Connection;
  }
}
