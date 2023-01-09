export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Style {
  name?: string;
  rounded?: 0 | 1;
  html?: 0 | 1;
  whiteSpace?: "wrap";
}
export const Style = {
  toString(style: Style): string {
    let property: keyof typeof style;
    const st = [];
    for (property in style) {
      if (property === "name") {
        st.push(`${style[property]}`);
      } else {
        st.push(`${property}=${style[property]}`);
      }
    }
    return st.join(";");
  },
  fromString(style: string): Style {
    const elems = style.split(";").filter((e) => e !== "");
    const s: Style = {};
    elems.forEach((e) => {
      if (e.indexOf("=") == -1) {
        s.name = e;
      } else {
        const [property, value] = e.split("=");
        switch (property) {
          case "html":
          case "rounded":
            s[property] = value === "1" ? 1 : 0;
            break;
          case "whiteSpace":
            if (value === "wrap") {
              s[property] = value;
            }
            break;
          default:
            console.warn(`Unexpected style ignored (${property}=${value})`);
        }
      }
    });
    return s;
  },
};

export interface MetaElement {
  kind: "shape" | "connection";
  identifier: string;
  label: string;
  style: Style;
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
  waypoints?: Point[];
}

export type Element = Shape | Connection;

export interface Diagram {
  identifier: string;
  name: string;
  elements: (Shape | Connection)[];
}

export interface File {
  diagrams: Diagram[];
}
