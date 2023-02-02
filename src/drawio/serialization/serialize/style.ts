import * as Model from "../../model.js";

export function stringify(style: Model.Style): string {
  type StyleMapperFn<T> = (key: string, value: T) => string;

  let property: keyof typeof style;
  const st = [];
  for (property in style) {
    if (property !== undefined && property in styleMapper) {
      const value = style[property];
      const f = styleMapper[property] as StyleMapperFn<typeof value>;
      st.push(f(property, value));
    } else {
      console.error(`Property ${property} is not implemented.`);
    }
  }
  if (st.length > 0) {
    return st.join(";") + ";";
  }

  return "";
}

const sourceArrowStyleMap: EnumMapper<Model.ArrowStyle> = {
  [Model.ArrowNone]: "none",
  [Model.ArrowClassic]: "classic",
  [Model.ArrowClassicThin]: "classicThin",
  [Model.ArrowOpen]: "open",
  [Model.ArrowOpenThin]: "openThin",
  [Model.ArrowOpenAsync]: "openAsync",
  [Model.ArrowBlock]: "block",
  [Model.ArrowBlockThin]: "blockThin",
  [Model.ArrowAsync]: "async",
  [Model.ArrowOval]: "oval",
  [Model.ArrowDiamond]: "diamond",
  [Model.ArrowDiamondThin]: "diamondThin",
  [Model.ArrowBox]: "box",
  [Model.ArrowHalfCircle]: "halfCircle",
  [Model.ArrowDash]: "dash",
  [Model.ArrowCross]: "cross",
  [Model.ArrowCirclePlus]: "circlePlus",
  [Model.ArrowCircle]: "circle",
  [Model.ArrowBaseDash]: "baseDash",
  [Model.ArrowERone]: "ERone",
  [Model.ArrowERmandOne]: "ERmandOne",
  [Model.ArrowERmany]: "ERmany",
  [Model.ArrowERoneToMany]: "ERoneToMany",
  [Model.ArrowERzeroToOne]: "ERzeroToOne",
  [Model.ArrowERzeroToMany]: "ERzeroToMany",
  [Model.ArrowDoubleBlock]: "doubleBlock",
};

const sourceFillStyleMap: EnumMapper<Model.FillStyle> = {
  [Model.FillNone]: "none",
  [Model.FillSolid]: "solid",
  [Model.FillCrossHatch]: "cross-hatch",
  [Model.FillDashed]: "dashed",
  [Model.FillDots]: "dots",
  [Model.FillHatch]: "hatch",
  [Model.FillZigZag]: "zigzag-line",
};

const sourceGradientDirectionMap: EnumMapper<Model.GradientDirection> = {
  [Model.East]: "east",
  [Model.North]: "north",
  [Model.Radial]: "radial",
  [Model.South]: "south",
  [Model.West]: "west",
};

const styleMapper = (function () {
  type Mapper<T extends object> = {
    [K in keyof Required<T>]-?: (
      key: string,
      value: Required<T>[K]
    ) => string;
  };

  function optionMapper(key: string, value: Model.Option): string {
    return `${key}=${value === Model.Yes ? "1" : "0"}`;
  }

  function enumMapper<T extends symbol>(map: EnumMapper<T>) {
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

  const m: Mapper<Model.Style> = {
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
    fillStyle: enumMapper(sourceFillStyleMap),
    strokeColor: stringMapper,
    dashed: optionMapper,
    dashPattern: arrayMapper,
    perimeterSpacing: numberMapper,
    opacity: numberMapper,
    gradientColor: stringMapper,
    gradientDirection: enumMapper(sourceGradientDirectionMap),
    shape: stringMapper,
  };

  return m;
})();

type EnumMapper<T extends symbol> = Record<T, string>;
