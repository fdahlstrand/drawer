import { Option, Shape, Style } from "./model.js";

export class ShapeBuilder {
  private shape: Shape;
  constructor(id: string) {
    this.shape = {
      kind: "shape",
      identifier: id,
      label: "",
      style: {},
      placeholders: new Map(),
    };
  }

  build(): Shape {
    return this.shape;
  }

  atPosition(x: number, y: number): ShapeBuilder {
    this.shape = {
      ...this.shape,
      position: { x, y },
    };

    return this;
  }

  withSize(width: number, height: number): ShapeBuilder {
    this.shape = {
      ...this.shape,
      size: { width, height },
    };

    return this;
  }

  withLabel(label: string): ShapeBuilder {
    this.shape = {
      ...this.shape,
      label,
    };

    return this;
  }

  usePlaceholders(): ShapeBuilder {
    this.shape = {
      ...this.shape,
      enablePlaceholders: Option.Yes,
    };

    return this;
  }

  withPlaceholder(key: string, value: string | number): ShapeBuilder {
    this.shape.placeholders.set(key, value.toString());

    return this;
  }

  withStyle(style: Style): ShapeBuilder {
    this.shape = {
      ...this.shape,
      style: {
        ...this.shape.style,
        ...style,
      },
    };

    return this;
  }
}
