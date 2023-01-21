export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

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

export type Styles = [
  ["name", string],
  ["rounded", Option],
  ["html", Option],
  ["whiteSpace", "wrap"],
  ["endArrow", ArrowStyle],
  ["startArrow", ArrowStyle],
  ["endFill", Option],
  ["startFill", Option],
  ["strokeWidth", number],
  ["fillColor", string],
  ["fillStyle", FillStyle],
  ["strokeColor", string],
  ["dashed", Option],
  ["dashPattern", number[]],
  ["perimeterSpacing", number],
  ["opacity", number],
  ["gradientColor", string],
  ["gradientDirection", GradientDirection],
  ["shape", string]
];
type MakeObject<T extends [string, unknown][]> = T extends [
  infer First extends [string, unknown],
  ...infer Rest extends [string, unknown][]
]
  ? { [P in First[0]]: First[1] } & MakeObject<Rest>
  : unknown;

export type Style = Partial<MakeObject<Styles>>;

type MetaElement = {
  kind: "shape" | "connection";
  identifier: string;
  label: string;
  style: Style;
  enablePlaceholders?: Option;
  placeholders?: Map<string, string>;
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

export type Element = Shape | Connection;

export type ElementBuilder = {
  build(): Element;
};

export type Diagram = {
  identifier: string;
  name: string;
  elements: (Shape | Connection | ElementBuilder)[];
  shadows?: Option;
};

export type File = {
  diagrams: Diagram[];
};
