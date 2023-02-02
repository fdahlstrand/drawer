import * as Model from "../../model.js";

export function parse(str: string): Model.Style {
  const elems = str ? str.split(";").filter((e) => e !== "") : [];
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
const targetArrowStyleMap = reverseMap(sourceArrowStyleMap);

const sourceFillStyleMap: EnumMapper<Model.FillStyle> = {
  [Model.FillNone]: "none",
  [Model.FillSolid]: "solid",
  [Model.FillCrossHatch]: "cross-hatch",
  [Model.FillDashed]: "dashed",
  [Model.FillDots]: "dots",
  [Model.FillHatch]: "hatch",
  [Model.FillZigZag]: "zigzag-line",
};
const targetFillStyleMap = reverseMap(sourceFillStyleMap);

const sourceGradientDirectionMap: EnumMapper<Model.GradientDirection> = {
  [Model.East]: "east",
  [Model.North]: "north",
  [Model.Radial]: "radial",
  [Model.South]: "south",
  [Model.West]: "west",
};
const targetGradientDirectionMap = reverseMap(sourceGradientDirectionMap);

const stringMapper = (function () {
  type Mapper = {
    [k: string]: (key: string, value: string) => Model.Style;
  };

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
      [property ?? key]: value === "1" ? Model.Yes : Model.No,
    });
  }

  function enumMapper<T extends symbol>(
    map: ReverseEnumMapper<T>,
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

  return <Mapper>{
    html: optionMapper(),
    rounded: optionMapper(),
    startFill: optionMapper(),
    endFill: optionMapper(),
    strokeWidth: numberMapper(),
    startArrow: enumMapper(targetArrowStyleMap),
    endArrow: enumMapper(targetArrowStyleMap),
    whiteSpace: stringMapper(),
    fillColor: stringMapper(),
    fillStyle: enumMapper(targetFillStyleMap),
    strokeColor: stringMapper(),
    dashed: optionMapper(),
    dashPattern: arrayMapper(),
    perimeterSpacing: numberMapper(),
    opacity: numberMapper(),
    gradientColor: stringMapper(),
    gradientDirection: enumMapper(targetGradientDirectionMap),
    shape: stringMapper(),
  };
})();

type EnumMapper<T extends symbol> = Record<T, string>;
type ReverseEnumMapper<T extends symbol> = { [k: string]: T };
function reverseMap<T extends symbol>(
  map: EnumMapper<T>
): ReverseEnumMapper<T> {
  let rev = {};

  Reflect.ownKeys(map).forEach((k) => {
    const value = Reflect.get(map, k);

    rev = {
      ...rev,
      [value as string]: k,
    };
  });

  return rev as ReverseEnumMapper<T>;
}
