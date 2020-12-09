/**This utility type is used to easily create an id based object of objects.*/
type Dictionary<T> = { readonly [id: string]: T };

export type EditorConfig = {
  nodes: NodeTypes;
  ports: PortTypes;
  settings: {
    zoom?: number;
    hideComments?: boolean;
  };
  defaultNodes?: defaultNode[];
  circularBehavior?: "prevent" | "warn" | "allow";
};

type nodeBase = {
  readonly id?: string;
  readonly coordinates?: { x?: number; y?: number };
  readonly width?: number;
  readonly height?: number;
  readonly color?: string;
};

export type comment = nodeBase & {
  readonly text: string;
  readonly isNew?: boolean;
};

export type Comments = Dictionary<comment>;

export type Connection = {
  readonly nodeId: string;
  readonly portName: string;
};

export type PortBuilderType = {
  type?: string;
  name?: string;
  label?: string;
  noControls?: boolean;
  color?: string;
  hidePort?: boolean;
  acceptTypes?: string[];
};

export type connection = Dictionary<readonly Connection[]>;

export type connections = {
  readonly inputs?: connection;
  readonly outputs?: connection;
};

export type Node = nodeBase & {
  readonly type: string;
  readonly label?: string;
  readonly initialWidth?: number;
  readonly connections?: connections;
  readonly root?: boolean;
  readonly addable?: boolean;
  readonly deletable?: boolean;
  readonly description?: string;
  readonly sortIndex?: number;
  readonly inputData?: { [portName: string]: { [controlName: string]: any } };
  readonly defaultNode?: boolean;
};

export type Nodes = Dictionary<Node>;

export type PortTypes = Dictionary<PortBuilderType>;

export type NodeTypes = Dictionary<NodeConfig>;

export type port =
  | ((ports: PortTypes, connections: connections) => PortBuilderType[])
  | PortBuilderType[];

export type NodeConfig = {
  type: string;
  label?: string;
  initialWidth?: number;
  inputs?: port;
  outputs?: port;
  root?: boolean;
  addable?: boolean;
  deletable?: boolean;
  description?: string;
  sortIndex?: number;
};

export type defaultNode = {
  readonly type: string;
  readonly coordinates?: { readonly x: number; readonly y: number };
};

export type coordinates = { readonly x: number; readonly y: number };
