import * as Model from "../model.js";

export const sourceArrowStyleMap: EnumMapper<Model.ArrowStyle> = {
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
export const targetArrowStyleMap = reverseMap(sourceArrowStyleMap);

export const sourceFillStyleMap: EnumMapper<Model.FillStyle> = {
  [Model.FillNone]: "none",
  [Model.FillSolid]: "solid",
  [Model.FillCrossHatch]: "cross-hatch",
  [Model.FillDashed]: "dashed",
  [Model.FillDots]: "dots",
  [Model.FillHatch]: "hatch",
  [Model.FillZigZag]: "zigzag-line",
};
export const targetFillStyleMap = reverseMap(sourceFillStyleMap);

export const sourceGradientDirectionMap: EnumMapper<Model.GradientDirection> =
  {
    [Model.East]: "east",
    [Model.North]: "north",
    [Model.Radial]: "radial",
    [Model.South]: "south",
    [Model.West]: "west",
  };
export const targetGradientDirectionMap = reverseMap(
  sourceGradientDirectionMap
);

export type EnumMapper<T extends symbol> = Record<T, string>;
export type ReverseEnumMapper<T extends symbol> = { [k: string]: T };
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
