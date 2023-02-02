import * as Model from "../../model.js";
import {
  EnumMapper,
  sourceArrowStyleMap,
  sourceFillStyleMap,
  sourceGradientDirectionMap,
} from "../style.map.js";

export function stringify(style: Model.Style): string {
  type StyleMapperFn<T> = (key: string, value: T) => string;

  let property: keyof typeof style;
  const st = [];
  for (property in style) {
    if (property !== undefined && property in styleMapper) {
      const value = style[property];
      const f = styleMapper[property] as StyleMapperFn<typeof value>;
      st.push(f(property, value));
    } else {
      console.error(`Property ${property} is not implemented.`);
    }
  }
  if (st.length > 0) {
    return st.join(";") + ";";
  }

  return "";
}

const styleMapper = (function () {
  type Mapper<T extends object> = {
    [K in keyof Required<T>]-?: (
      key: string,
      value: Required<T>[K]
    ) => string;
  };

  function optionMapper(key: string, value: Model.Option): string {
    return `${key}=${value === Model.Yes ? "1" : "0"}`;
  }

  function enumMapper<T extends symbol>(map: EnumMapper<T>) {
    return (key: string, value: T): string => {
      return `${key}=${map[value]}`;
    };
  }

  function numberMapper(key: string, value: number): string {
    return `${key}=${value}`;
  }

  function stringMapper(key: string, value: string): string {
    return `${key}=${value}`;
  }

  function styleNameMapper(key: string, value: string): string {
    return `${value}`;
  }

  function arrayMapper(key: string, value: number[]): string {
    return `${key}=${value.join(" ")}`;
  }

  const m: Mapper<Model.Style> = {
    name: styleNameMapper,
    html: optionMapper,
    rounded: optionMapper,
    whiteSpace: stringMapper,
    startFill: optionMapper,
    endFill: optionMapper,
    strokeWidth: numberMapper,
    startArrow: enumMapper(sourceArrowStyleMap),
    endArrow: enumMapper(sourceArrowStyleMap),
    fillColor: stringMapper,
    fillStyle: enumMapper(sourceFillStyleMap),
    strokeColor: stringMapper,
    dashed: optionMapper,
    dashPattern: arrayMapper,
    perimeterSpacing: numberMapper,
    opacity: numberMapper,
    gradientColor: stringMapper,
    gradientDirection: enumMapper(sourceGradientDirectionMap),
    shape: stringMapper,
  };

  return m;
})();
