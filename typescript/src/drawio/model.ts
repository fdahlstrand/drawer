export interface Point {
    x: number,
    y: number
}

export interface Size {
    width: number,
    height: number,
}

export type StyleElement =
    string | ['rounded', 0 | 1]

export const Style = {
    rounded: (value: 0 | 1): StyleElement => ['rounded', value]
}

export interface Element {
    kind: 'object' | 'relation',
    identifier: string,
    label: string,
    size?: Size,
    position?: Point,
    style: StyleElement[]
}

export interface Diagram {
    identifier: string
    name: string
}

export interface File {
    diagrams: Diagram[]
}