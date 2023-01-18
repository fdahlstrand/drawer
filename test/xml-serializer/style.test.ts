import { No, Yes } from "../../src/drawio/drawio.js";
import { Style } from "../../src/drawio/xml-serializer/style.js";

const options = ["html", "rounded", "startFill", "endFill", "dashed"];

describe("Stringify style", () => {
  test("empty style generates nothing", () => {
    expect(Style.stringify({})).toBe("");
  });

  test("name renders single element", () => {
    const name = "foo";
    expect(Style.stringify({ name })).toBe(`${name};`);
  });

  test("option enabled (Yes) sets value to 1", () => {
    expect(Style.stringify({ html: Yes })).toBe("html=1;");
  });

  test("option disabled (No) sets value to 0", () => {
    expect(Style.stringify({ html: No })).toBe("html=0;");
  });

  test.each(options)("stringifies option '%s'", (opt) => {
    expect(Style.stringify({ [opt]: Yes })).toBe(`${opt}=1;`);
  });
});

describe("Parse style", () => {
  test("no style generates empty style", () => {
    expect(Style.parse(undefined)).toStrictEqual({});
  });

  test("empty string returns empty style", () => {
    expect(Style.parse("")).toStrictEqual({});
  });

  test("parse single element sets name", () => {
    const name = "foo";
    expect(Style.parse(`${name};`)).toStrictEqual({ name });
  });

  test("parse option with value 0, sets style to No", () => {
    expect(Style.parse("html=0;")).toStrictEqual({ html: No });
  });

  test("parse option with value 99, sets style to No", () => {
    expect(Style.parse("html=99;")).toStrictEqual({ html: No });
  });

  test("parse option with value 1, sets style to Yes", () => {
    expect(Style.parse("html=1;")).toStrictEqual({ html: Yes });
  });

  test.each(options)("parses option '%s'", (opt) => {
    expect(Style.parse(`${opt}=1;`)).toStrictEqual({ [opt]: Yes });
  });
});
