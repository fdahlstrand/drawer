import { Yes } from "../../src/drawio/drawio.js";
import { Style } from "../../src/drawio/xml-serializer/style.js";
import * as Model from "../../src/drawio/model.js";

describe("Style.stringify corner cases", () => {
  it("generates emptry string from null style", () => {
    expect(Style.stringify({})).toBe("");
  });

  it("ignores unknown style properties", () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    expect(Style.stringify({ unknownProperty: Yes } as Model.Style)).toBe("");
  });

  it("writes an error to the console for unknown style properties", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    Style.stringify({ unknownProperty: Yes } as Model.Style);
    expect(consoleSpy).toBeCalled();
  });
});

describe("Style.stringify name property", () => {
  it("just renders the name of the property", () => {
    const name = "foo";
    expect(Style.stringify({ name })).toBe(`${name};`);
  });
});

describe("Style.stringify properties of type 'number'", () => {
  const propertyMap: StyleMap<number> = {
    opacity: "opacity",
    perimeterSpacing: "perimeterSpacing",
    strokeWidth: "strokeWidth",
  };

  test.each(mapping(propertyMap))(
    "stringifies property '$key' as '$mappedTo'",
    (data) => {
      const value = 19;
      expect(Style.stringify({ [data.key]: value })).toBe(
        `${data.mappedTo}=${value};`
      );
    }
  );
});

describe("Style.stringify properties of type 'string'", () => {
  const propertyMap: StyleMap<string, "name"> = {
    fillColor: "fillColor",
    gradientColor: "gradientColor",
    shape: "shape",
    strokeColor: "strokeColor",
    whiteSpace: "whiteSpace",
  };

  test.each(mapping(propertyMap))(
    "stringifies property '$key' as '$mappedTo'",
    (data) => {
      const value = "foo";
      expect(Style.stringify({ [data.key]: value })).toBe(
        `${data.mappedTo}=${value};`
      );
    }
  );
});

describe("Style.stringify properties of type 'Option'", () => {
  const propertyMap: StyleMap<Model.Option> = {
    dashed: "dashed",
    endFill: "endFill",
    html: "html",
    rounded: "rounded",
    startFill: "startFill",
  };

  const optionMap: EnumMap<Model.Option> = {
    [Model.Yes]: "1",
    [Model.No]: "0",
  };

  test.each(mapping(propertyMap))(
    "stringifies property '$key' as '$mappedTo'",
    (data) => {
      expect(Style.stringify({ [data.key]: Model.Yes })).toBe(
        `${data.mappedTo}=1;`
      );
    }
  );

  test.each(enumMapping(optionMap))(
    "stringifies enum value '$key' to '$mappedTo'",
    (data) => {
      expect(Style.stringify({ html: data.key as Model.Option })).toBe(
        `html=${data.mappedTo};`
      );
    }
  );
});

type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

type StyleMap<T, O extends string | symbol = never> = Omit<
  Record<SelectProperty<Model.Style, T>, string>,
  O
>;

type EnumMap<T extends symbol> = Record<T, string>;

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
