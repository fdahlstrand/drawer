import { ConnectionBuilder } from "./connection-builder.js";
import { ShapeBuilder } from "./shape-builder.js";

export * as Serializer from "./serialization/serialization.js";
export * from "./model.js";

export function Shape(id: string): ShapeBuilder {
  return new ShapeBuilder(id);
}

export function Connection(
  id: string,
  source: string,
  target: string
): ConnectionBuilder {
  return new ConnectionBuilder(id, source, target);
}

export function Rectangle(id: string): ShapeBuilder {
  return new ShapeBuilder(id).withSize(120, 60);
}
