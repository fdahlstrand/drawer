import { No, Yes } from "../../src/drawio/drawio.js";
import { Style } from "../../src/drawio/xml-serializer/style.js";
import * as Model from "../../src/drawio/model.js";

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
      opacity: stringifyExpectation,
      perimeterSpacing: stringifyExpectation,
      strokeWidth: stringifyExpectation,
    };

    itStringifiesProperties(numberProperties, 19);
  });

  describe("string style properties", () => {
    const stringProperties: Omit<StringifyProperty<string>, "name"> = {
      fillColor: stringifyExpectation,
      gradientColor: stringifyExpectation,
      shape: stringifyExpectation,
      strokeColor: stringifyExpectation,
      whiteSpace: stringifyExpectation,
    };

    itStringifiesProperties(
      stringProperties as StringifyProperty<string>,
      "foo"
    );
  });

  describe("option style properties", () => {
    const optionEnum: F<Model.Option> = {
      [Model.Yes]: _enum("1", testStringifyEnumValue),
      [Model.No]: _enum("0", testStringifyEnumValue),
    };

    const optionProperties: StringifyProperty<Model.Option> = {
      dashed: stringifyExpectation,
      endFill: stringifyExpectation,
      html: stringifyExpectation,
      rounded: stringifyExpectation,
      startFill: stringifyExpectation,
    };

    itStringifiesEnumValues(optionEnum, "html");
    itStringifiesProperties(optionProperties, Model.Yes, "1");
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

type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

type StringifyProperty<T> = Record<
  SelectProperty<Model.Style, T>,
  (property: string, value: T, target?: string) => void
>;

function stringifyExpectation<T>(
  property: string,
  value: T,
  target = String(value)
) {
  expect(Style.stringify({ [property]: value })).toBe(
    `${property}=${target};`
  );
}

function itStringifiesProperties<T, U extends StringifyProperty<T>>(
  stringProperties: U,
  value: T,
  stringifiedValue = String(value)
) {
  let k: keyof typeof stringProperties;
  for (k in stringProperties) {
    it(`can stringify property '${String(k)}'`, () => {
      stringProperties[k](String(k), value, stringifiedValue);
    });
  }
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

function itStringifiesEnumValues<U extends symbol, T extends F<U>>(
  _enum: T,
  property: string
) {
  Reflect.ownKeys(_enum).forEach((k) => {
    const x = Reflect.get(_enum, k);
    it(`can stringify enum value '${String(k)}'`, () => {
      x.fn(property, k as U, x.mapped);
    });
  });
}

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
