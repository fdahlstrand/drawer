import * as Model from "../model.js";

const Yes = Model.Option.Yes;
const No = Model.Option.No;

const arrowStyleMap: { [key in keyof typeof Model.ArrowStyle]: string } = {
  None: "none",
  Classic: "classic",
  ClassicThin: "classicThin",
  Open: "open",
  OpenThin: "openThin",
  OpenAsync: "openAsync",
  Block: "block",
  BlockThin: "blockThin",
  Async: "async",
  Oval: "oval",
  Diamond: "diamond",
  DiamondThin: "diamondThin",
  Box: "box",
  HalfCircle: "halfCircle",
  Dash: "dash",
  Cross: "cross",
  CirclePlus: "circlePlus",
  Circle: "circle",
  BaseDash: "baseDash",
  ERone: "ERone",
  ERmandOne: "ERmandOne",
  ERmany: "ERmany",
  ERoneToMany: "ERoneToMany",
  ERzeroToOne: "ERzeroToOne",
  ERzeroToMany: "ERzeroToMany",
  DoubleBlock: "doubleBlock",
};

function assertUnreachable(x: never): never {
  x;
  throw new Error("Didn't expect to get here");
}

function unsupportedStyle(property: string, value: string) {
  console.warn(`Unexpected style ignored (${property}=${value})`);
}

export class Style {
  static stringify(style: Model.Style): string {
    let property: keyof typeof style;
    const st = [];
    for (property in style) {
      switch (property) {
        case "name":
          st.push(`${style[property]}`);
          break;
        case "endFill":
        case "html":
        case "rounded":
        case "startFill":
          st.push(`${property}=${style[property] === Yes ? "1" : "0"}`);
          break;
        case "strokeWidth":
          st.push(`${property}=${style[property]}`);
          break;
        case "whiteSpace":
          st.push(`${property}=${style[property]}`);
          break;
        case "endArrow":
        case "startArrow":
          st.push(`${property}=${arrowStyleMap[style[property]]}`);
          break;
        default:
          assertUnreachable(property);
      }
    }
    return st.join(";") + ";";
  }

  static parse(str: string): Model.Style {
    const elems = str.split(";").filter((e) => e !== "");
    const s: Model.Style = {};
    const option = (v: string): Model.Option => (v === "1" ? Yes : No);
    elems.forEach((e) => {
      const [property, value] = e.split("=") as [string, string];

      if (value === undefined) {
        s.name = property;
      }

      switch (property) {
        case "endFill":
        case "html":
        case "rounded":
        case "startFill":
          s[property] = option(value);
          break;
        case "whiteSpace":
          if (value === "wrap") {
            s.whiteSpace = value;
          }
          break;
        case "strokeWidth":
          s[property] = Number(value);
          break;
        case "endArrow": {
          let k: keyof typeof Model.ArrowStyle;
          for (k in arrowStyleMap) {
            if (value === arrowStyleMap[k]) {
              s.endArrow =
                Model.ArrowStyle[k as keyof typeof Model.ArrowStyle];
            }
          }
          break;
        }
        case "startArrow": {
          let k: keyof typeof Model.ArrowStyle;
          for (k in arrowStyleMap) {
            if (value === arrowStyleMap[k]) {
              s.startArrow =
                Model.ArrowStyle[k as keyof typeof Model.ArrowStyle];
            }
          }
          break;
        }
        default:
          if (value === undefined) {
            s["name"] = value;
          } else {
            unsupportedStyle(property, value);
          }
      }
    });
    return s;
  }
}
