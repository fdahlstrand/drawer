import * as Style from "../../src/drawio/serialization/deserialize/style.js";
import * as Model from "../../src/drawio/model.js";
import { EnumMap, mapping, StyleMap, Mapping } from "./style.util.js";

describe("parse properties of type 'number'", () => {
  const propertyMap: StyleMap<number> = {
    opacity: "opacity",
    perimeterSpacing: "perimeterSpacing",
    strokeWidth: "strokeWidth",
  };

  test.each(mapping(propertyMap))(
    "parses property '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: Mapping) => {
      const value = 19;
      expect(Style.parse(`${mappedTo}=${value}`)).toStrictEqual({
        [key]: value,
      });
    }
  );
});

describe("parse properties of type 'number[]'", () => {
  const propertyMap: StyleMap<number[]> = {
    dashPattern: "dashPattern",
  };

  test.each(mapping(propertyMap))(
    "parses property '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: Mapping) => {
      const value = [9, 8, 23, 4];
      expect(Style.parse(`${mappedTo}=${value.join(" ")};`)).toStrictEqual({
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
    ({ key, mappedTo }: Mapping) => {
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
    ({ key, mappedTo }: Mapping) => {
      expect(Style.parse(`${mappedTo}=1`)).toStrictEqual({
        [key]: Model.Yes,
      });
    }
  );

  test.each(mapping(enumMap))(
    "parses enum value '$key' when given as '$mappedTo'",
    ({ key, mappedTo }: Mapping) => {
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
