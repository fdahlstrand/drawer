import * as Model from "../model.js";

export class Style {
  static stringify(style: Model.Style): string {
    let property: keyof typeof style;
    const st = [];
    for (property in style) {
      if (property in styleMapper) {
        st.push(styleMapper[property](property, style[property]));
      } else {
        console.error(`Property ${property} is not implemented.`);
      }
    }
    return st.join(";") + ";";
  }

  static parse(str: string): Model.Style {
    const elems = str.split(";").filter((e) => e !== "");
    let s: Model.Style = {};

    elems.forEach((e) => {
      const [property, value] = e.split("=") as [string, string];

      if (value === undefined) {
        s.name = property;
      } else {
        if (property in stringMapper) {
          s = { ...s, ...stringMapper[property](property, value) };
        } else {
          console.warn(`Unknown property '${property}' ignored.`);
        }
      }
    });
    return s;
  }
}

const sourceArrowStyleMap: Mapper<Model.ArrowStyle> = {
  None: "none",
  Classic: "classic",
  ClassicThin: "classicThin",
  Open: "open",
  OpenThin: "openThin",
  OpenAsync: "openAsync",
  Block: "block",
  BlockThin: "blockThin",
  Async: "async",
  Oval: "oval",
  Diamond: "diamond",
  DiamondThin: "diamondThin",
  Box: "box",
  HalfCircle: "halfCircle",
  Dash: "dash",
  Cross: "cross",
  CirclePlus: "circlePlus",
  Circle: "circle",
  BaseDash: "baseDash",
  ERone: "ERone",
  ERmandOne: "ERmandOne",
  ERmany: "ERmany",
  ERoneToMany: "ERoneToMany",
  ERzeroToOne: "ERzeroToOne",
  ERzeroToMany: "ERzeroToMany",
  DoubleBlock: "doubleBlock",
};
const targetArrowStyleMap = reverseMap(sourceArrowStyleMap);

const styleMapper = (function () {
  function optionMapper(key: string, value: Model.Option): string {
    return `${key}=${value === Model.Option.Yes ? "1" : "0"}`;
  }

  function enumMapper<T extends string>(map: Mapper<T>) {
    return (key: string, value: T): string => {
      return `${key}=${map[value]}`;
    };
  }

  function numberMapper(key: string, value: number): string {
    return `${key}=${value}`;
  }

  function stringMapper(key: string, value: string): string {
    return `${key}=${value}`;
  }

  function styleNameMapper(key: string, value: string): string {
    return `${value}`;
  }

  function arrayMapper(key: string, value: number[]): string {
    return `${key}=${value.join(" ")}`;
  }

  type StyleValue = number | string | Model.ArrowStyle | number[];
  return {
    name: styleNameMapper,
    html: optionMapper,
    rounded: optionMapper,
    whiteSpace: stringMapper,
    startFill: optionMapper,
    endFill: optionMapper,
    strokeWidth: numberMapper,
    startArrow: enumMapper(sourceArrowStyleMap),
    endArrow: enumMapper(sourceArrowStyleMap),
    fillColor: stringMapper,
    strokeColor: stringMapper,
    dashed: optionMapper,
    dashPattern: arrayMapper,
    perimeterSpacing: numberMapper,
  } as {
    [key in keyof Model.Style]: (key: string, value: StyleValue) => string;
  };
})();

const stringMapper = (function () {
  function numberMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: Number(value),
    });
  }

  function stringMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value,
    });
  }

  function optionMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value === "1" ? Model.Option.Yes : Model.Option.No,
    });
  }

  function enumMapper<T extends string>(
    map: ReverseMapper<T>,
    property?: keyof Model.Style
  ) {
    return (key: string, value: string) => ({
      [property ?? key]: map[value],
    });
  }

  function arrayMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value.split(" ").map((s) => Number(s)),
    });
  }

  return {
    html: optionMapper(),
    rounded: optionMapper(),
    startFill: optionMapper(),
    endFill: optionMapper(),
    strokeWidth: numberMapper(),
    startArrow: enumMapper(targetArrowStyleMap),
    endArrow: enumMapper(targetArrowStyleMap),
    whiteSpace: stringMapper(),
    fillColor: stringMapper(),
    strokeColor: stringMapper(),
    dashed: optionMapper(),
    dashPattern: arrayMapper(),
    perimeterSpacing: numberMapper(),
  } as { [key: string]: (key: string, value: string) => Model.Style };
})();

type Mapper<T extends string> = { [k in T]: string };
type ReverseMapper<T extends string> = { [k: string]: T };
function reverseMap<T extends string>(src: Mapper<T>): ReverseMapper<T> {
  return Object.fromEntries(
    Object.entries(src).map((e) => [e[1], e[0] as T])
  );
}
