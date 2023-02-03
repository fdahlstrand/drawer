import { toXml } from "../diagram.js";
import * as Model from "../../../model.js";
import { MxCell } from "../../xml.js";

describe("serialization of a diagram", () => {
  it("sets the identifier of the diagram", () => {
    const id = "A";
    const xml = toXml({ ...defaultObject, identifier: id });
    expect(xml[":@"].id).toBe(id);
  });

  it("sets the name of the diagram", () => {
    const name = "A";
    const xml = toXml({ ...defaultObject, name });
    expect(xml[":@"].name).toBe(name);
  });

  it("disables shadows when option is undefined", () => {
    const xml = toXml(defaultObject);
    expect(xml.diagram[0][":@"].shadow).toBe("0");
  });

  it("disables shadows when option is explicity unset", () => {
    const xml = toXml({ ...defaultObject, shadows: Model.No });
    expect(xml.diagram[0][":@"].shadow).toBe("0");
  });

  it("disables shadows when option is set", () => {
    const xml = toXml({ ...defaultObject, shadows: Model.Yes });
    expect(xml.diagram[0][":@"].shadow).toBe("1");
  });

  it("contains a root element and a background layer", () => {
    const xml = toXml(defaultObject);
    const elementContainer = xml.diagram[0].mxGraphModel[0].root;
    expect(elementContainer.length).toBe(2);
    expect(elementContainer[0]).toStrictEqual(root);
    expect(elementContainer[1]).toStrictEqual(backgroundLayer);
  });

  it("contains a root element and a background layer for a diagram with additional elements", () => {
    const xml = toXml({ ...defaultObject, elements: [defaultElement] });
    const elementContainer = xml.diagram[0].mxGraphModel[0].root;
    expect(elementContainer.length).toBe(3);
    expect(elementContainer[0]).toStrictEqual(root);
    expect(elementContainer[1]).toStrictEqual(backgroundLayer);
  });
});

const defaultObject: Model.Diagram = {
  identifier: "<not used>",
  name: "<not used>",
  elements: [],
};

const defaultElement: Model.Shape = {
  identifier: "<not used>",
  kind: "shape",
  label: "<not used>",
  style: {},
};

const root: MxCell = {
  ":@": {
    id: "0",
  },
  mxCell: [],
};
const backgroundLayer: MxCell = {
  ":@": {
    id: "1",
    parent: "0",
  },
  mxCell: [],
};
