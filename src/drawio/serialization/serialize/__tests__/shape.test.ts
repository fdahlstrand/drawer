import { toXml } from "../shape.js";
import * as Model from "../../../model.js";
import { MxCell, MxObject } from "../../xml.js";

describe("serialization of a shape without placeholders", () => {
  it("sets the vertex property", () => {
    const xml = toXml(defaultObject);

    expect(xml[":@"].vertex).toBe("1");
  });

  it("serializes the identifer of the shape", () => {
    const id = "test-id-a";
    const xml = toXml({
      ...defaultObject,
      identifier: id,
    });
    expect(xml[":@"].id).toBe(id);
  });

  it("serializes the label of the shape", () => {
    const label = "test-label-a";
    const xml = toXml({
      ...defaultObject,
      label,
    });
    expect(xml[":@"].value).toBe(label);
  });

  it("serializes unspecified position to (0,0)", () => {
    const xml = toXml(defaultObject) as MxCell;
    expect(xml.mxCell[0][":@"].x).toBe(0);
    expect(xml.mxCell[0][":@"].y).toBe(0);
  });

  it("serializes the shape position", () => {
    const x = 123;
    const y = 321;

    const xml = toXml({ ...defaultObject, position: { x, y } }) as MxCell;
    expect(xml.mxCell[0][":@"].x).toBe(x);
    expect(xml.mxCell[0][":@"].y).toBe(y);
  });

  it("serializes unspecified size to (240,120)", () => {
    const xml = toXml(defaultObject) as MxCell;
    expect(xml.mxCell[0][":@"].width).toBe(240);
    expect(xml.mxCell[0][":@"].height).toBe(120);
  });

  it("serializes the shape size", () => {
    const width = 123;
    const height = 321;

    const xml = toXml({
      ...defaultObject,
      size: { width, height },
    }) as MxCell;
    expect(xml.mxCell[0][":@"].width).toBe(width);
    expect(xml.mxCell[0][":@"].height).toBe(height);
  });
});

describe("serialization of a shape with placeholders", () => {
  it("sets the vertex property", () => {
    const xml = toXml(defaultObjectWithPlaceholders) as MxObject;

    expect(xml.object[0][":@"].vertex).toBe("1");
  });

  it("serializes the identifer of the shape", () => {
    const id = "test-id-a";
    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      identifier: id,
    }) as MxObject;
    expect(xml[":@"].id).toBe(id);
  });

  it("serializes the label of the shape", () => {
    const label = "test-label-a";
    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      label,
    }) as MxObject;
    expect(xml[":@"].label).toBe(label);
  });

  it("serializes unspecified position to (0,0)", () => {
    const xml = toXml(defaultObjectWithPlaceholders) as MxObject;
    expect(xml.object[0].mxCell[0][":@"].x).toBe(0);
    expect(xml.object[0].mxCell[0][":@"].y).toBe(0);
  });

  it("serializes the shape position", () => {
    const x = 123;
    const y = 321;

    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      position: { x, y },
    }) as MxObject;
    expect(xml.object[0].mxCell[0][":@"].x).toBe(x);
    expect(xml.object[0].mxCell[0][":@"].y).toBe(y);
  });

  it("serializes unspecified size to (240,120)", () => {
    const xml = toXml(defaultObjectWithPlaceholders) as MxObject;
    expect(xml.object[0].mxCell[0][":@"].width).toBe(240);
    expect(xml.object[0].mxCell[0][":@"].height).toBe(120);
  });

  it("serializes the shape size", () => {
    const width = 123;
    const height = 321;

    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      size: { width, height },
    }) as MxObject;
    expect(xml.object[0].mxCell[0][":@"].width).toBe(width);
    expect(xml.object[0].mxCell[0][":@"].height).toBe(height);
  });

  it("sets the placholder attribute when enabled", () => {
    const xml = toXml(defaultObjectWithPlaceholders) as MxObject;
    expect(xml[":@"].placeholders).toBe("1");
  });

  it("it unsets the placholder attribute when disabled", () => {
    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      enablePlaceholders: Model.No,
      placeholders: new Map([["a", "z"]]),
    }) as MxObject;
    expect(xml[":@"].placeholders).toBe("0");
  });

  it("it serializes placholder attributes", () => {
    const xml = toXml({
      ...defaultObjectWithPlaceholders,
      placeholders: new Map([
        ["a", "z"],
        ["b", "x"],
      ]),
    }) as MxObject;
    expect(xml[":@"].a).toBe("z");
    expect(xml[":@"].b).toBe("x");
  });
});

const defaultObject: Model.Shape = {
  identifier: "<not used>",
  kind: "shape",
  label: "<not used>",
  style: {},
};

const defaultObjectWithPlaceholders: Model.Shape = {
  ...defaultObject,
  enablePlaceholders: Model.Yes,
};
