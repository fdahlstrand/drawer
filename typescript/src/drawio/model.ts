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
};

export interface Element {
  kind: "object" | "relation";
  identifier: string;
  label: string;
  size?: Size;
  position?: Point;
  style: Style;
}

export interface Diagram {
  identifier: string;
  name: string;
  elements: Element[];
}

export interface File {
  diagrams: Diagram[];
}
