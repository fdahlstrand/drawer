export interface MxFile {
  ":@": {
    compressed: false;
    modified: string;
  };
  mxfile: Diagram[];
}

export interface Diagram {
  ":@": {
    id: string;
    name: string;
  };
  diagram: MxGraphModel[];
}

interface MxGraphModel {
  ":@": {
    grid?: "0" | "1";
    gridSize?: number;
    guides?: "0" | "1";
    tooltips?: "0" | "1";
    connect?: "0" | "1";
    arrows?: "0" | "1";
    fold?: "0" | "1";
    page?: "0" | "1";
    pageScale?: number;
    pageWidth?: number;
    pageHeight?: number;
    math?: "0" | "1";
    shadow?: "0" | "1";
  };
  mxGraphModel: [
    {
      root: MxElement[];
    }
  ];
}

interface MxCell {
  ":@": {
    id?: string;
    parent?: string;
    value?: string;
    style?: string;
    vertex?: "0" | "1";
    edge?: "0" | "1";
    source?: string;
    target?: string;
  };
  mxCell: MxGeometry[];
}

interface MxGeometry {
  ":@": {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    relative?: "0" | "1";
    as: "geometry";
  };
  mxGeometry: [];
}

export type MxElement = MxCell;
