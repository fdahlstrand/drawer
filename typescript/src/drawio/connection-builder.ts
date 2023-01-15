import { Connection, Option, Point, Style } from "./model.js";

export class ConnectionBuilder {
  private connection: Connection;

  constructor(id: string, source: string, target: string) {
    this.connection = {
      kind: "connection",
      identifier: id,
      label: "",
      style: {},
      source,
      target,
      placeholders: new Map(),
    };
  }

  build(): Connection {
    return this.connection;
  }

  withLabel(label: string): ConnectionBuilder {
    this.connection = {
      ...this.connection,
      label,
    };

    return this;
  }

  usePlaceholders(): ConnectionBuilder {
    this.connection = {
      ...this.connection,
      enablePlaceholders: Option.Yes,
    };

    return this;
  }

  withPlaceholder(key: string, value: string | number): ConnectionBuilder {
    this.connection.placeholders.set(key, value.toString());

    return this;
  }

  withStyle(style: Style): ConnectionBuilder {
    this.connection = {
      ...this.connection,
      style: {
        ...this.connection.style,
        ...style,
      },
    };

    return this;
  }

  addWaypoint(x: number, y: number): ConnectionBuilder {
    this.connection.waypoints = [...this.connection.waypoints, { x, y }];

    return this;
  }

  withWaypoints(waypoints: Point[]): ConnectionBuilder {
    this.connection = {
      ...this.connection,
      waypoints,
    };

    return this;
  }
}
