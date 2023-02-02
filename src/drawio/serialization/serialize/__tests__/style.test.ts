import * as Style from "../style.js";
import * as Model from "../../../model.js";
import {
  EnumMap,
  mapping,
  StyleMap,
  Mapping,
} from "../../__tests__/style.util.js";

describe("Style.stringify corner cases", () => {
  it("generates emptry string from null style", () => {
    expect(Style.stringify({})).toBe("");
  });

  it("ignores unknown style properties", () => {
    jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    expect(
      Style.stringify({ unknownProperty: Model.Yes } as Model.Style)
    ).toBe("");
  });

  it("writes an error to the console for unknown style properties", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {
      true;
    });
    Style.stringify({ unknownProperty: Model.Yes } as Model.Style);
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
    ({ key, mappedTo }: Mapping) => {
      const value = 19;
      expect(Style.stringify({ [key]: value })).toBe(`${mappedTo}=${value};`);
    }
  );
});

describe("Style.stringify properties of type 'number[]'", () => {
  const propertyMap: StyleMap<number[]> = {
    dashPattern: "dashPattern",
  };

  test.each(mapping(propertyMap))(
    "stringifies property '$key' as '$mappedTo'",
    ({ key, mappedTo }: Mapping) => {
      const value = [1, 2, 3, 4];
      expect(Style.stringify({ [key]: value })).toBe(
        `${mappedTo}=${value.join(" ")};`
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
    ({ key, mappedTo }: Mapping) => {
      const value = "foo";
      expect(Style.stringify({ [key]: value })).toBe(`${mappedTo}=${value};`);
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
    ({ key, mappedTo }: Mapping) => {
      expect(Style.stringify({ [key]: Model.Yes })).toBe(`${mappedTo}=1;`);
    }
  );

  test.each(mapping(optionMap))(
    "stringifies enum value '$key' to '$mappedTo'",
    (data) => {
      expect(Style.stringify({ html: data.key as Model.Option })).toBe(
        `html=${data.mappedTo};`
      );
    }
  );
});
