type nodeBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type comment = nodeBase & {
  text: string;
  isNew?: boolean;
};

export type comments = {
  [id: string]: comment;
};

type Connection = {
  nodeId: string;
  portName: string;
};

export type Node = nodeBase & {
  type: string;
  connections: {
    inputs: { [id: string]: Connection };
    outputs: { [id: string]: Connection };
  };
  inputData: {
    [id: string]: { string?: string; boolean?: boolean; number?: number };
  };
};

export type nodes = {
  [id: string]: Node;
};
