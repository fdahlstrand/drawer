import { No, Yes } from "../../src/drawio/drawio.js";
import { Style } from "../../src/drawio/xml-serializer/style.js";
import * as Model from "../../src/drawio/model.js";

const options = ["html", "rounded", "startFill", "endFill", "dashed"];
const numbers = ["opacity", "strokeWidth", "perimeterSpacing"];
const strings = [
  "whiteSpace",
  "fillColor",
  "strokeColor",
  "gradientColor",
  "shape",
];

describe("Stringify style", () => {
  test("empty style generates nothing", () => {
    expect(Style.stringify({})).toBe("");
  });

  test("name renders single element", () => {
    const name = "foo";
    expect(Style.stringify({ name })).toBe(`${name};`);
  });

  test("unknown property is not rendered", () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    expect(Style.stringify({ unknownProperty: Yes } as Model.Style)).toBe("");
  });

  test("unknown property issues error", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    Style.stringify({ unknownProperty: Yes } as Model.Style);
    expect(consoleSpy).toBeCalled();
  });

  describe("stringify option", () => {
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

  describe("stringify number values", () => {
    test.each(numbers)("set '%s' to a number", (prop) => {
      const v = 19;
      expect(Style.stringify({ [prop]: v })).toBe(`${prop}=${v};`);
    });
  });

  describe("stringify string value", () => {
    test.each(strings)("set '%s' to a string", (prop) => {
      const v = "foo";
      expect(Style.stringify({ [prop]: v })).toBe(`${prop}=${v};`);
    });
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

  test("unknown property is not parsed", () => {
    jest.spyOn(console, "warn").mockImplementation(() => {
      true;
    });

    expect(Style.parse("foo=1")).not.toContain("foo");
  });

  test("unknown property renders warning", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {
      true;
    });

    Style.parse("foo=1");
    expect(consoleSpy).toBeCalled();
  });

  describe("parse options", () => {
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

  describe("parse numbers", () => {
    test.each(numbers)("parses number for '%s'", (prop) => {
      const v = 29;
      expect(Style.parse(`${prop}=${v}`)).toStrictEqual({ [prop]: v });
    });
  });

  describe("parse strings", () => {
    test.each(strings)("parsers string for '%s'", (prop) => {
      const v = "baz";
      expect(Style.parse(`${prop}=${v}`)).toStrictEqual({ [prop]: v });
    });
  });
});
