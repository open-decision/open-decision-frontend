//The following types describe the configuration objects used in the node-editor.

/**
 * The NodeConfig describes a certain type of preconfigured node. This is used to share the configuration of a node type across many uses in the state.
 */
export type NodeConfig = {
  /**
   * The type of this NodeType. Basically the name of the NodeType.
   */
  type: string;
  /**
   * The label is the name given to the node in the UI.
   */
  label: string;
  /**
   * The precconfigured inputPorts of a NodeType.
   */
  inputPorts?: PortConfig[];
  /**
   * The precconfigured outputPorts of a NodeType.
   */
  outputPorts?: PortConfig[];
  /**
   * A root Node is an entry point into the tree.
   */
  root: boolean;
  /**
   * Needs to be true for Nodes of this type to be **addable** in the node-editor.
   */
  addable: boolean;
  /**
   * Needs to be true for Nodes of this type to be **deletable** in the node-editor.
   */
  deletable: boolean;
  /** A human readable description of this NodeType. */
  description: string;
  /**
   * Ranks a NodeType to make them sortable based on their importance.
   */
  sortPriority: number;
};

/**
 * The NodeTypes is an object indexed by the name of the node types. Each key has a NodeConfig assosciated.
 */
export type NodeTypes = Record<string, NodeConfig>;

/**
 * Similar to a NodeConfig is a PortConfig used to preconfigure a certain type of port. This way a port type can be shared across many uses by its name.
 */
export type PortConfig = {
  /**
   * The type of this PortType. Basically the name of this PortType.
   */
  type: string;
  /**
   * The human readable label of this PortType.
   */
  label: string;
  name: string;
  /**
   * The color of this PortType.
   */
  color: string;
  /**
   * By default Ports only accept Connections of their own type. The accepted Connections can be extended by providing other PortTypes type properties.
   */
  acceptTypes?: string[];
};

/**
 * The PortTypes is an object indexed by the name of the port types. Each key has a PortConfig associated with it.
 */
export type PortTypes = Record<string, PortConfig>;

//------------------------------------------------------------------------------

//The following types describe the objects used as part of the node-editors state.

/**
 * The nodeBase describes properties that are common to all nodes in the editor.
 */
type nodeBase = {
  /**
   * The unique id of each Node.
   */
  id: string;
  /**
   * The positional coordinates of this Node.
   */
  coordinates: coordinates;
  width?: number;
  height?: number;
};

/**
 * The position of nodes is tracked as x and y coordinates.
 */
export type coordinates = [number, number];

/**
 * A comment is a special type of node.
 */
export type Comment = nodeBase & {
  /**
   * The text content of the comment.
   */
  text: string;
  /**
   * The color of the comment.
   */
  color?: string;
};

/**
 * The comments are an object indexed by unique strings.
 */
export type Comments = Record<string, Comment>;

/**
 * A Node is the main type of element in the node-editor. The properties of a node are  focused on information unique to each Node in the Editor even if the type of Node is used more than once. The shared configuration of a Node are part of the NodeConfig which is associated via the type property.
 */
export type Node = nodeBase & {
  /**
   * The type is analogous to the type of a preconfigured node. Information is looked up based on this type so it must be a type that is part of the config object.
   */
  type: string;
  runtimeData?: DOMRect;
  /**
   * Contains the information to which other Nodes and specifically which port a Node is connected to.
   */
  //  connections: Transputs;
};

/**
 * The Nodes are an object indexed by a unique string. Each key has a Node assosciated.
 */
export type Nodes = Record<string, Node>;

/**
 * The information used to uniquely track a Connection between two ports of distinct Nodes.
 */
export type Connection = {
  nodeId: string;
  portName: string;
};

/**
 * The Connections are an object indexed by a unique string. Each key has an Array of Connections assosciated.
 */
export type Connections = Record<string, Connection[]>;

/**
 * Groups the input and output Connections for use as part of each Nodes state.
 */
export type Transputs = {
  /**
   * All input Connections.
   */
  inputs: Connections;
  /**
   * All output Connections.
   */
  outputs: Connections;
};

//------------------------------------------------------------------------------
