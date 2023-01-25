import { Style } from "../../src/drawio/xml-serializer/style.js";
import * as Model from "../../src/drawio/model.js";

export type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

type StyleMap<T, O extends string | symbol = never> = Omit<
  Record<SelectProperty<Model.Style, T>, string>,
  O
>;

type TestData = {
  key: string | symbol;
  mappedTo: string;
};

function mapping<T extends string>(m: Record<T, string>): TestData[] {
  return Object.keys(m).map((k) => ({
    key: k,
    mappedTo: m[k as T],
  }));
}

function enumMapping<T extends symbol>(map: EnumMap<T>): TestData[] {
  return Reflect.ownKeys(map).map(
    (k) => ({ key: k, mappedTo: map[k as T] } as TestData)
  );
}

type EnumMap<T extends symbol> = Record<T, string>;

describe("parse properties of type 'number'", () => {
  const propertyMap: StyleMap<number> = {
    opacity: "opacity",
    perimeterSpacing: "perimeterSpacing",
    strokeWidth: "strokeWidth",
  };

  test.each(mapping(propertyMap))(
    "parses property '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: TestData) => {
      const value = 19;
      expect(Style.parse(`${mappedTo}=${value}`)).toStrictEqual({
        [key]: value,
      });
    }
  );
});

describe("parse properties of type 'string'", () => {
  const propertyMap: StyleMap<string, "name"> = {
    fillColor: "fillColor",
    gradientColor: "gradientColor",
    shape: "shape",
    strokeColor: "strokeColor",
    whiteSpace: "whiteSpace",
  };

  test.each(mapping(propertyMap))(
    "parses property '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: TestData) => {
      const value = "foo";
      expect(Style.parse(`${mappedTo}=${value}`)).toStrictEqual({
        [key]: value,
      });
    }
  );
});

describe("parse properties of type 'option'", () => {
  const propertyMap: StyleMap<Model.Option> = {
    dashed: "dashed",
    endFill: "endFill",
    html: "html",
    rounded: "rounded",
    startFill: "startFill",
  };

  const enumMap: EnumMap<Model.Option> = {
    [Model.Yes]: "1",
    [Model.No]: "0",
  };

  test.each(mapping(propertyMap))(
    "parses property '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: TestData) => {
      expect(Style.parse(`${mappedTo}=1`)).toStrictEqual({
        [key]: Model.Yes,
      });
    }
  );

  test.each(enumMapping(enumMap))(
    "parses enum value '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: TestData) => {
      expect(Style.parse(`html=${mappedTo};`)).toStrictEqual({ html: key });
    }
  );

  test("parse option with unsupported value sets the property to No", () => {
    expect(Style.parse("html=99;")).toStrictEqual({ html: Model.No });
  });
});

describe("style parsing corner cases", () => {
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
});
