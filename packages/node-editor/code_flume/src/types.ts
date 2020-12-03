type nodeBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  color?: string;
};

export type comment = nodeBase & {
  text: string;
  isNew?: boolean;
};

export type comments = {
  [id: string]: comment;
};

export type Connection = {
  nodeId: string;
  portName: string;
};

type PortBuilderType = {
  type?: string;
  name?: string;
  label?: string;
  noControls?: boolean;
  color?: string;
  hidePort?: boolean;
  controls?: boolean;
};

type PortConfig = {
  name?: string;
  label?: string;
  hidePort?: boolean;
  color?: string;
  controls?: any;
  noControls?: boolean;
};

export type connection = {
  [id: string]: Connection[];
};
// | ((ports: PortTypes) => PortBuilderType[])
// | PortBuilderType[]
// | [];

export type connections = {
  inputs: connection;
  outputs: connection;
};

export type Node = nodeBase & {
  type: string;
  label?: string;
  initialWidth?: number;
  connections: connections;
  root?: boolean;
  addable?: boolean;
  deletable?: boolean;
  description?: string;
  sortIndex?: number;
  inputData: any;
  defaultNode?: boolean;
};

export type nodes = {
  [id: string]: Node;
};

export type PortTypes = {
  [id: string]: (config?: PortConfig) => PortBuilderType;
};

export type NodeTypes = {
  [id: string]: NodeType;
};

export type NodeType = {
  type: string;
  label?: string;
  initialWidth?: number;
  inputs?: ((ports: PortTypes) => PortBuilderType[]) | PortBuilderType[];
  outputs?: ((ports: PortTypes) => PortBuilderType[]) | PortBuilderType[];
  root?: boolean;
  addable?: boolean;
  deletable?: boolean;
  description?: string;
  sortIndex?: number;
};

export type defaultNode = { type: string; x: number; y: number };
