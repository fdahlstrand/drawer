import { No, Yes } from "../../src/drawio/drawio.js";
import { Style } from "../../src/drawio/xml-serializer/style.js";
import * as Model from "../../src/drawio/model.js";

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

    const options: ParseProperty<Model.Option> = {
      dashed: parseExpectation,
      endFill: parseExpectation,
      html: parseExpectation,
      rounded: parseExpectation,
      startFill: parseExpectation,
    };

    itParsesProperties(options, Model.Yes, "1");
  });

  describe("parse numbers", () => {
    const numbers: ParseProperty<number> = {
      opacity: parseExpectation,
      perimeterSpacing: parseExpectation,
      strokeWidth: parseExpectation,
    };

    itParsesProperties(numbers, 29);
  });

  describe("parse strings", () => {
    const strings: Omit<ParseProperty<string>, "name"> = {
      fillColor: parseExpectation,
      gradientColor: parseExpectation,
      shape: parseExpectation,
      strokeColor: parseExpectation,
      whiteSpace: parseExpectation,
    };

    itParsesProperties(strings as ParseProperty<string>, "baz");
  });
});

export type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

type ParseProperty<T> = Record<
  SelectProperty<Model.Style, T>,
  (property: string, value: T, parsedValue?: string) => void
>;

function parseExpectation<T>(
  property: string,
  value: T,
  parsedValue = String(value)
) {
  expect(Style.parse(`${property}=${parsedValue}`)).toStrictEqual({
    [property]: value,
  });
}

function itParsesProperties<T, U extends ParseProperty<T>>(
  properties: U,
  value: T,
  parseValue = String(value)
) {
  let k: keyof typeof properties;
  for (k in properties) {
    it(`can parse property '${String(k)}'`, () => {
      properties[k](String(k), value, parseValue);
    });
  }
}
