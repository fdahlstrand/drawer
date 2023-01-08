import { XMLBuilder } from "fast-xml-parser";
import * as Model from "./model.js";

interface MxFile {
  ":@": {
    compressed: false;
    modified: string;
  };
  mxfile: Diagram[];
}

const MxFile = {
  toXml: (diagrams: Model.Diagram[]): MxFile => ({
    ":@": {
      compressed: false,
      modified: new Date().toISOString(),
    },
    mxfile: diagrams.map(Diagram.toXml),
  }),
};

interface Diagram {
  ":@": {
    id: string;
    name: string;
  };
  diagram: MxGraphModel[];
}
const Diagram = {
  toXml: (diagram: Model.Diagram): Diagram => ({
    ":@": {
      id: diagram.identifier,
      name: diagram.name,
    },
    diagram: [MxGraphModel.toXml(diagram)],
  }),
};

interface MxGraphModel {
  ":@": {
    grid?: 0 | 1;
    gridSize?: number;
    guides?: 0 | 1;
    tooltips?: 0 | 1;
    connect?: 0 | 1;
    arrows?: 0 | 1;
    fold?: 0 | 1;
    page?: 0 | 1;
    pageScale?: number;
    pageWidth?: number;
    pageHeight?: number;
    math?: 0 | 1;
    shadow?: 0 | 1;
  };
  mxGraphModel: [
    {
      root: MxElement[];
    }
  ];
}
const MxGraphModel = {
  toXml: (diagram: Model.Diagram): MxGraphModel => ({
    ":@": {
      grid: 1,
      gridSize: 10,
      guides: 1,
      tooltips: 1,
      connect: 1,
      arrows: 1,
      fold: 1,
      page: 1,
      pageScale: 1,
      pageWidth: 850,
      pageHeight: 1100,
      math: 1,
      shadow: 1,
    },
    mxGraphModel: [
      {
        root: [
          { mxCell: [], ":@": { id: "0" } },
          { mxCell: [], ":@": { id: "1", parent: "0" } },
          ...diagram.elements.map(MxElement.toXml),
        ],
      },
    ],
  }),
};

interface MxCell {
  ":@": {
    id?: string;
    parent?: string;
    value?: string;
    style?: string;
    vertex?: 0 | 1;
  };
  mxCell: MxGeometry[];
}

interface MxGeometry {
  ":@": {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    relative?: 0 | 1;
    as: "geometry";
  };
  mxGeometry: [];
}

type MxElement = MxCell;

const MxElement = {
  toXml: (elem: Model.Element): MxElement => ({
    ":@": {
      id: elem.identifier,
      parent: "1",
      value: elem.label,
      style: Model.Style.toString(elem.style),
      vertex: 1,
    },
    mxCell: [
      {
        ":@": {
          x: elem.position.x,
          y: elem.position.y,
          height: elem.size.height,
          width: elem.size.width,
          as: "geometry",
        },
        mxGeometry: [],
      },
    ],
  }),
};

export function toXml(diagrams: Model.Diagram[]): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    preserveOrder: true,
    attributeNamePrefix: "",
    suppressEmptyNode: true,
    format: true,
  });

  const obj = [MxFile.toXml(diagrams)];
  const xml: string = builder.build(obj);

  return xml.trimStart();
}
