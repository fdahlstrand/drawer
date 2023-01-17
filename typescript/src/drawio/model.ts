export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export const ArrowStyle = {
  None: "None",
  Classic: "Classic",
  ClassicThin: "ClassicThin",
  Open: "Open",
  OpenThin: "OpenThin",
  OpenAsync: "OpenAsync",
  Block: "Block",
  BlockThin: "BlockThin",
  Async: "Async",
  Oval: "Oval",
  Diamond: "Diamond",
  DiamondThin: "DiamondThin",
  Box: "Box",
  HalfCircle: "HalfCircle",
  Dash: "Dash",
  Cross: "Cross",
  CirclePlus: "CirclePlus",
  Circle: "Circle",
  BaseDash: "BaseDash",
  ERone: "ERone",
  ERmandOne: "ERmandOne",
  ERmany: "ERmany",
  ERoneToMany: "ERoneToMany",
  ERzeroToOne: "ERzeroToOne",
  ERzeroToMany: "ERzeroToMany",
  DoubleBlock: "DoubleBlock",
} as const;
export type ArrowStyle = (typeof ArrowStyle)[keyof typeof ArrowStyle];

export const FillStyle = {
  None: "None",
  Hatch: "Hatch",
  Solid: "Solid",
  Dots: "Dots",
  CrossHatch: "CrossHatch",
  Dashed: "Dashed",
  ZigZag: "ZigZag",
} as const;
export type FillStyle = (typeof FillStyle)[keyof typeof FillStyle];

export const GradientDirection = {
  Radial: "Radial",
  North: "North",
  East: "East",
  West: "West",
  South: "South",
} as const;
export type GradientDirection =
  (typeof GradientDirection)[keyof typeof GradientDirection];

export const Option = {
  Yes: 1,
  No: 0,
} as const;
export type Option = (typeof Option)[keyof typeof Option];

export interface Style {
  name?: string;
  rounded?: Option;
  html?: Option;
  whiteSpace?: "wrap";
  endArrow?: ArrowStyle;
  endFill?: Option;
  startArrow?: ArrowStyle;
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
}

export interface MetaElement {
  kind: "shape" | "connection";
  identifier: string;
  label: string;
  style: Style;
  enablePlaceholders?: Option;
  placeholders?: Map<string, string>;
}

export interface Shape extends MetaElement {
  kind: "shape";
  size?: Size;
  position?: Point;
}

export interface Connection extends MetaElement {
  kind: "connection";
  source: string;
  target: string;
  sourcePoint?: Point;
  targetPoint?: Point;
  waypoints?: Point[];
}

export type Element = Shape | Connection;

export interface ElementBuilder {
  build(): Element;
}

export interface Diagram {
  identifier: string;
  name: string;
  elements: (Shape | Connection | ElementBuilder)[];
  shadows?: Option;
}

export interface File {
  diagrams: Diagram[];
}
