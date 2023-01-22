export type File = {
  diagrams: Diagram[];
};

export type Diagram = {
  identifier: string;
  name: string;
  elements: (Element | ElementBuilder)[];
  shadows?: Option;
};

export type Element = Shape | Connection;

export type ElementBuilder = {
  build(): Element;
};

export type Shape = {
  kind: "shape";
  size?: Size;
  position?: Point;
} & MetaElement;

export type Connection = {
  kind: "connection";
  source: string;
  target: string;
  sourcePoint?: Point;
  targetPoint?: Point;
  waypoints?: Point[];
} & MetaElement;

type MetaElement = {
  kind: "shape" | "connection";
  identifier: string;
  label: string;
  style: Style;
  enablePlaceholders?: Option;
  placeholders?: Map<string, string>;
};

export type Style = {
  name?: string;
  rounded?: Option;
  html?: Option;
  whiteSpace?: string;
  endArrow?: ArrowStyle;
  startArrow?: ArrowStyle;
  endFill?: Option;
  startFill?: Option;
  strokeWidth?: number;
  fillColor?: string;
  fillStyle?: FillStyle;
  strokeColor?: string;
  dashed?: Option;
  dashPattern?: number[];
  perimeterSpacing?: number;
  opacity?: number;
  gradientColor?: string;
  gradientDirection?: GradientDirection;
  shape?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export const Yes = Symbol("Yes");
export const No = Symbol("No");
export type Option = typeof Yes | typeof No;

export const ArrowNone = Symbol("None");
export const ArrowClassic = Symbol("Classic");
export const ArrowClassicThin = Symbol("ClassicThin");
export const ArrowOpen = Symbol("Open");
export const ArrowOpenThin = Symbol("OpenThin");
export const ArrowOpenAsync = Symbol("OpenAsync");
export const ArrowBlock = Symbol("Block");
export const ArrowBlockThin = Symbol("BlockThin");
export const ArrowAsync = Symbol("Async");
export const ArrowOval = Symbol("Oval");
export const ArrowDiamond = Symbol("Diamond");
export const ArrowDiamondThin = Symbol("DiamondThin");
export const ArrowBox = Symbol("Box");
export const ArrowHalfCircle = Symbol("HalfCircle");
export const ArrowDash = Symbol("Dash");
export const ArrowCross = Symbol("Cross");
export const ArrowCirclePlus = Symbol("CirclePlus");
export const ArrowCircle = Symbol("Circle");
export const ArrowBaseDash = Symbol("BaseDash");
export const ArrowERone = Symbol("ERone");
export const ArrowERmandOne = Symbol("ERmandOne");
export const ArrowERmany = Symbol("ERmany");
export const ArrowERoneToMany = Symbol("ERoneToMany");
export const ArrowERzeroToOne = Symbol("ERzeroToOne");
export const ArrowERzeroToMany = Symbol("ERzeroToMany");
export const ArrowDoubleBlock = Symbol("DoubleBlock");
export type ArrowStyle =
  | typeof ArrowNone
  | typeof ArrowClassic
  | typeof ArrowClassicThin
  | typeof ArrowOpen
  | typeof ArrowOpenThin
  | typeof ArrowOpenAsync
  | typeof ArrowBlock
  | typeof ArrowBlockThin
  | typeof ArrowAsync
  | typeof ArrowOval
  | typeof ArrowDiamond
  | typeof ArrowDiamondThin
  | typeof ArrowBox
  | typeof ArrowHalfCircle
  | typeof ArrowDash
  | typeof ArrowCross
  | typeof ArrowCirclePlus
  | typeof ArrowCircle
  | typeof ArrowBaseDash
  | typeof ArrowERone
  | typeof ArrowERmandOne
  | typeof ArrowERmany
  | typeof ArrowERoneToMany
  | typeof ArrowERzeroToOne
  | typeof ArrowERzeroToMany
  | typeof ArrowDoubleBlock;

export const FillNone = Symbol("None");
export const FillHatch = Symbol("Hatch");
export const FillSolid = Symbol("Solid");
export const FillDots = Symbol("Dots");
export const FillCrossHatch = Symbol("CrossHatch");
export const FillDashed = Symbol("Dashed");
export const FillZigZag = Symbol("ZigZag");
export type FillStyle =
  | typeof FillNone
  | typeof FillHatch
  | typeof FillSolid
  | typeof FillDots
  | typeof FillCrossHatch
  | typeof FillDashed
  | typeof FillZigZag;

export const Radial = Symbol("Radial");
export const North = Symbol("North");
export const East = Symbol("East");
export const West = Symbol("West");
export const South = Symbol("South");
export type GradientDirection =
  | typeof Radial
  | typeof North
  | typeof East
  | typeof West
  | typeof South;
