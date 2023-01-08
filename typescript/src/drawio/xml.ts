import * as Model from './model.js'

interface MxPoint {
    mxPoint: {
        ":@": {
            x: number,
            y: number
        }
    }
}

interface MxArray {
    Array: {
        ":@": {
            as: 'points'
        },
        points: MxPoint[]
    }
}

interface MxGeometry {
    mxGeometry: {
        ":@": {
            height?: number,
            width?: number,
            relative?: 0 | 1,
            as: 'geometry'
        }
    }
}

interface MxCell {
    mxCell: {
        ":@": {
            id?: string,
            parent?: string,
            value?: string,
            style?: string,
            vertex?: 0 | 1,
        }
        geometry?: MxGeometry
    }
}

type MxElement = MxCell;

function fromStyle(style: Model.Style) {
    let property: keyof typeof style;
    let st = [];
    for (property in style) {
        if (property === "name") {
            st.push(`${style[property]}`)
        } else {
            st.push(`${property}=${style[property]}`)
        }
    }
    return st.join(';')
}

function fromElement(elem: Model.Element): MxElement {
    return {
        mxCell: {
            ":@": {
                id: elem.identifier,
                parent: "1",
                value: elem.label ?? undefined,
                style: fromStyle(elem.style),
                vertex: 1
            }
        }
    }
}

function fromPoint(pt: Model.Point): MxPoint {
    return {
        mxPoint: {
            ":@": {
                x: pt.x,
                y: pt.y
            }
        }
    }
}

function fromArray(pts: Model.Point[]): MxArray {
    return {
        Array: {

            ":@": {
                as: 'points'
            },
            points: pts.map(fromPoint)
        }
    }
}