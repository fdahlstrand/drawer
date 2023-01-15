export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export enum ArrowStyle {
  None,
  Classic,
  ClassicThin,
  Open,
  OpenThin,
  OpenAsync,
  Block,
  BlockThin,
  Async,
  Oval,
  Diamond,
  DiamondThin,
  Box,
  HalfCircle,
  Dash,
  Cross,
  CirclePlus,
  Circle,
  BaseDash,
  ERone,
  ERmandOne,
  ERmany,
  ERoneToMany,
  ERzeroToOne,
  ERzeroToMany,
  DoubleBlock,
}

export enum Option {
  No,
  Yes,
}

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
  strokeColor?: string;
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
