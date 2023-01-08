export interface Point {
    x: number,
    y: number
}

export interface Size {
    width: number,
    height: number,
}


export interface Style {
    name?: string,
    rounded?: 0 | 1,
}

export interface Element {
    kind: 'object' | 'relation',
    identifier: string,
    label: string,
    size?: Size,
    position?: Point,
    style: Style,
}

export interface Diagram {
    identifier: string
    name: string
}

export interface File {
    diagrams: Diagram[]
}
