import * as Model from "./model.js";

interface MxPoint {
  mxPoint: {
    ":@": {
      x: number;
      y: number;
    };
  };
}

interface MxArray {
  Array: {
    ":@": {
      as: "points";
    };
    points: MxPoint[];
  };
}

interface MxGeometry {
  mxGeometry: {
    ":@": {
      x?: number,
      y?: number,
      height?: number;
      width?: number;
      relative?: 0 | 1;
      as: "geometry";
    };
  };
}

interface MxCell {
  mxCell: {
    ":@": {
      id?: string;
      parent?: string;
      value?: string;
      style?: string;
      vertex?: 0 | 1;
    };
    geometry?: MxGeometry;
  };
}

interface MxGraphModel {
  mxGraphModel: {
    ":@": {
      grid?: 0 | 1,
      gridSize?: number,
      guides?: 0 | 1,
      tooltips?: 0 | 1,
      connect?: 0 | 1,
      arrows?: 0 | 1,
      fold?: 0 | 1,
      page?: 0 | 1,
      pageScale?: number,
      pageWidth?: number,
      pageHeight?: number,
      math?: 0 | 1,
      shadow?: 0 | 1,
    },
    root: {
      root: {
        objects: MxElement[]
      }
    }
  }
}

interface Diagram {
  diagram: {
    ":@": {
      id: string,
      name: string
    },
    model: MxGraphModel
  }
}

type MxElement = MxCell;

function fromStyle(style: Model.Style) {
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
}

function geometryFromElement(elem: Model.Element): MxGeometry {
  return {
    mxGeometry: {
      ":@": {
        x: elem.position.x,
        y: elem.position.y,
        width: elem.size.width,
        height: elem.size.height,
        as: "geometry"
      }
    }
  }
}

function fromDiagram(diagram: Model.Diagram): Diagram {
  return {
    diagram: {
      ":@": {
        id: diagram.identifier,
        name: diagram.name
      },
      model: {
        mxGraphModel: {
          ":@": {
            grid: 1,
            gridSize: 10,
            guides: 1,
            tooltips: 1,
            connect: 1,
            arrows: 1,
            fold: 1,
            pageScale: 1,
            pageWidth: 850,
            pageHeight: 1100,
            math: 0,
            shadow: 0
          },
          root: {
            root: {
              objects: [
                {
                  mxCell: {
                    ":@": { id: "0"},
                  }
                },
                {
                  mxCell: {
                    ":@": { id: "1", parent: "0" }
                  }
                },
                ...diagram.elements.map(fromElement)
              ]
            }
          }
        }
      }
    }
  }

}

function fromElement(elem: Model.Element): MxElement {
  return {
    mxCell: {
      ":@": {
        id: elem.identifier,
        parent: "1",
        value: elem.label ?? undefined,
        style: fromStyle(elem.style),
        vertex: 1,
      },
      geometry: geometryFromElement(elem)
    },
  };
}

function fromPoint(pt: Model.Point): MxPoint {
  return {
    mxPoint: {
      ":@": {
        x: pt.x,
        y: pt.y,
      },
    },
  };
}

function fromArray(pts: Model.Point[]): MxArray {
  return {
    Array: {
      ":@": {
        as: "points",
      },
      points: pts.map(fromPoint),
    },
  };
}
