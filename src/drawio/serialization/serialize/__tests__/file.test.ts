import { toXml } from "../file.js";

describe("serialization to mxfile XML element", () => {
  it("does not use compression", () => {
    const xml = toXml({ diagrams: [] });
    expect(xml[":@"].compressed).toBeFalsy();
  });

  it("sets the modified date within 10ms", () => {
    const xml = toXml({ diagrams: [] });
    const delta = Date.now() - Date.parse(xml[":@"].modified);
    expect(delta).toBeLessThan(10);
    expect(delta).toBeGreaterThanOrEqual(0);
  });

  it("serializes diagrams", () => {
    const xml = toXml({
      diagrams: [
        { name: "A", identifier: "A", elements: [] },
        { name: "B", identifier: "B", elements: [] },
      ],
    });
    expect(xml.mxfile.length).toBe(2);
  });
});
