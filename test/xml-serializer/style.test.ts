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

type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

type StringifyTestFn<T> = (
  property: string,
  value: T,
  target?: string
) => void;
type StringifyProperty<T> = Record<
  SelectProperty<Model.Style, T>,
  StringifyTestFn<T>
>;

function testStringifyProperty<T>(
  property: string,
  value: T,
  target = String(value)
) {
  expect(Style.stringify({ [property]: value })).toBe(
    `${property}=${target};`
  );
}

type F<E extends symbol> = Record<
  E,
  { mapped: string; fn: StringifyEnumTestFn<E> }
>;
type StringifyEnumTestFn<E> = (
  property: string,
  value: E,
  str: string
) => void;
function testStringifyEnumValue<E>(property: string, value: E, str: string) {
  expect(Style.stringify({ [property]: value })).toBe(`${property}=${str};`);
}

function _enum<E>(mapped: string, fn: StringifyEnumTestFn<E>) {
  return { mapped, fn };
}

const optionsx: F<Model.Option> = {
  [Model.Yes]: _enum("1", testStringifyEnumValue),
  [Model.No]: _enum("0", testStringifyEnumValue),
};

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

  describe("numeric style properties", () => {
    const numberProperties: StringifyProperty<number> = {
      opacity: testStringifyProperty,
      perimeterSpacing: testStringifyProperty,
      strokeWidth: testStringifyProperty,
    };

    let k: keyof typeof numberProperties;
    for (k in numberProperties) {
      it(`can stringify property ${k}`, () => {
        numberProperties[k](k, 19);
      });
    }
  });

  describe("string style properties", () => {
    const stringProperties: Omit<StringifyProperty<string>, "name"> = {
      fillColor: testStringifyProperty,
      gradientColor: testStringifyProperty,
      shape: testStringifyProperty,
      strokeColor: testStringifyProperty,
      whiteSpace: testStringifyProperty,
    };

    let k: keyof typeof stringProperties;
    for (k in stringProperties) {
      it(`can stringify property '${k}'`, () => {
        stringProperties[k](k, "foo");
      });
    }
  });

  describe("option style properties", () => {
    Reflect.ownKeys(optionsx).forEach((k) => {
      const x = Reflect.get(optionsx, k);
      it(`can stringify enum value '${String(k)}'`, () => {
        x.fn("html", k, x.mapped);
      });
    });

    const optionProperties: StringifyProperty<Model.Option> = {
      dashed: testStringifyProperty,
      endFill: testStringifyProperty,
      html: testStringifyProperty,
      rounded: testStringifyProperty,
      startFill: testStringifyProperty,
    };

    let k: keyof typeof optionProperties;
    for (k in optionProperties) {
      it(`can stringify property ${k}`, () => {
        optionProperties[k](k, Model.Yes, "1");
      });
    }
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
