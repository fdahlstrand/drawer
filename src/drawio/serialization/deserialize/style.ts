import * as Model from "../../model.js";
import {
  ReverseEnumMapper,
  targetArrowStyleMap,
  targetFillStyleMap,
  targetGradientDirectionMap,
} from "../style.map.js";

export function parse(str: string): Model.Style {
  const elems = str ? str.split(";").filter((e) => e !== "") : [];
  let s: Model.Style = {};

  elems.forEach((e) => {
    const [property, value] = e.split("=") as [string, string];

    if (value === undefined) {
      s.name = property;
    } else {
      if (property in stringMapper) {
        s = { ...s, ...stringMapper[property](property, value) };
      } else {
        console.warn(`Unknown property '${property}' ignored.`);
      }
    }
  });
  return s;
}

const stringMapper = (function () {
  type Mapper = {
    [k: string]: (key: string, value: string) => Model.Style;
  };

  function numberMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: Number(value),
    });
  }

  function stringMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value,
    });
  }

  function optionMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value === "1" ? Model.Yes : Model.No,
    });
  }

  function enumMapper<T extends symbol>(
    map: ReverseEnumMapper<T>,
    property?: keyof Model.Style
  ) {
    return (key: string, value: string) => ({
      [property ?? key]: map[value],
    });
  }

  function arrayMapper(property?: keyof Model.Style) {
    return (key: string, value: string): Model.Style => ({
      [property ?? key]: value.split(" ").map((s) => Number(s)),
    });
  }

  const mapper: Mapper = {
    html: optionMapper(),
    rounded: optionMapper(),
    startFill: optionMapper(),
    endFill: optionMapper(),
    strokeWidth: numberMapper(),
    startArrow: enumMapper(targetArrowStyleMap),
    endArrow: enumMapper(targetArrowStyleMap),
    whiteSpace: stringMapper(),
    fillColor: stringMapper(),
    fillStyle: enumMapper(targetFillStyleMap),
    strokeColor: stringMapper(),
    dashed: optionMapper(),
    dashPattern: arrayMapper(),
    perimeterSpacing: numberMapper(),
    opacity: numberMapper(),
    gradientColor: stringMapper(),
    gradientDirection: enumMapper(targetGradientDirectionMap),
    shape: stringMapper(),
  };

  return mapper;
})();
