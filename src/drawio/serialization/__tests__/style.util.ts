import * as Model from "../../model.js";

type SelectProperty<T extends object, U> = {
  [P in keyof Required<T>]: Required<T>[P] extends U ? P : never;
}[keyof T];

export type StyleMap<T, O extends string | symbol = never> = Omit<
  Record<SelectProperty<Model.Style, T>, string>,
  O
>;

export type EnumMap<T extends symbol> = Record<T, string>;

export type Mapping = {
  key: string | symbol;
  mappedTo: string;
};

export function mapping<T extends string>(map: {
  [key: string]: string;
}): Mapping[] {
  return Reflect.ownKeys(map).map(
    (k) => ({ key: k, mappedTo: map[k as T] } as Mapping)
  );
}
