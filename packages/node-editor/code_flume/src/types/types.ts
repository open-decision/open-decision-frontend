type nodeBase = {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
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

export type PortBuilderType = {
  type?: string;
  name?: string;
  label?: string;
  noControls?: boolean;
  color?: string;
  hidePort?: boolean;
  controls?: ControlConfigs[];
  acceptTypes?: string[];
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
  inputs?: connection;
  outputs?: connection;
};

export type Node = nodeBase & {
  type: string;
  label?: string;
  initialWidth?: number;
  connections?: connections;
  root?: boolean;
  addable?: boolean;
  deletable?: boolean;
  description?: string;
  sortIndex?: number;
  inputData?: { [portName: string]: { [controlName: string]: any } };
  defaultNode?: boolean;
};

export type nodes = {
  [id: string]: Node;
};

export type PortTypes = {
  [id: string]: PortBuilderType;
};

export type NodeTypes = {
  [id: string]: NodeConfig;
};

export type port =
  | ((
      ports: PortTypes,
      connections: connections,
      context: any
    ) => PortBuilderType[])
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

export type defaultNode = { type: string; x: number; y: number };

export type Control = {
  type: string;
  label: string;
  name: string;
  defaultValue: string;
  setValue: (oldData: any, newData: any) => any;
};

interface BaseControlConfig {
  type: string;
  name: string;
  label: string;
  setValue?: (oldData: any, newData: any) => any;
}

interface TextControlConfig extends BaseControlConfig {
  placeholder?: string;
  defaultValue: string;
}

interface SelectControlConfig extends BaseControlConfig {
  options: { value: string; label: string; description?: string }[];
  defaultValue: string;
}

interface MultiSelectControlConfig extends BaseControlConfig {
  options: { value: string; label: string; description?: string }[];
  defaultValue: string[];
}

interface NumberControlConfig extends BaseControlConfig {
  step?: number;
  defaultValue: number;
}

interface CheckboxControlConfig extends BaseControlConfig {
  defaultValue: boolean;
}

interface CustomControlConfig extends BaseControlConfig {
  render: (
    data: any,
    onChange: (data: any) => void,
    context: any,
    redraw: () => void,
    portProps: PortProps,
    inputData: any
  ) => JSX.Element;
}

export type ControlConfigs =
  | TextControlConfig
  | SelectControlConfig
  | MultiSelectControlConfig
  | NumberControlConfig
  | CheckboxControlConfig
  | CustomControlConfig;

type PortProps = {
  label: string;
  inputLabel: string;
  name: string;
  portName: string;
  defaultValue: any;
  inputData: any;
};

export type coordinates = { x: number; y: number };
