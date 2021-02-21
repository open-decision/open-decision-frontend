//The following types describe the configuration objects used in the node-editor.

/**
 * The NodeConfig describes a certain type of preconfigured node. This is used to share the configuration of a node type across many uses in the state.
 */
export type nodeConfig = {
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
  inputPorts?: portConfig[];
  /**
   * The precconfigured outputPorts of a NodeType.
   */
  outputPorts?: portConfig[];
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
  color?: string;
  width: number;
  height: number;
};

/**
 * The NodeTypes is an object indexed by the name of the node types. Each key has a NodeConfig assosciated.
 */
export type nodeTypes = Record<string, nodeConfig>;

/**
 * Similar to a NodeConfig is a PortConfig used to preconfigure a certain type of port. This way a port type can be shared across many uses by its name.
 */
export type portConfig = {
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
export type portTypes = Record<string, portConfig>;

//------------------------------------------------------------------------------

//The following types describe the objects used as part of the node-editors state.

/**
 * The nodeBase describes properties that are common to all nodes in the editor.
 */
type nodeBase = {
  /**
   * The positional coordinates of this Node.
   */
  coordinates: coordinates;
  width: number;
  height?: number;
};

/**
 * The position of nodes is tracked as x and y coordinates.
 */
export type coordinates = [number, number];

/**
 * A comment is a special type of node.
 */
export type comment = nodeBase & {
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
export type comments = Record<string, comment>;

/**
 * A Node is the main type of element in the node-editor. The properties of a node are  focused on information unique to each Node in the Editor even if the type of Node is used more than once. The shared configuration of a Node are part of the NodeConfig which is associated via the type property.
 */
export type node = nodeBase & {
  /**
   * The type is analogous to the type of a preconfigured node. Information is looked up based on this type so it must be a type that is part of the config object.
   */
  type: string;
  name: string;
};

/**
 * The Nodes are an object indexed by a unique string. Each key has a Node assosciated.
 */
export type nodes = Record<string, node>;

/**
 * A Tuple of coordinates to describe start and end points of something.
 */
export type connectionCoordinates = [coordinates, coordinates];

/**
 * The information associated with an individual edge.
 */
export type edge = {
  nodeId: string;
};

/**
 * The Object holding all the edges. Each property is the nodeId of the originating node. Each associated value is an array of all the edges connected to this node.
 */
export type edges = Record<string, edge[]>;

/**
 * Describes the data used to communicate necessary information about a node to connection calculations.
 */
export type nodePositionalData = {
  coordinates: coordinates;
  width: number;
  height: number;
};

//------------------------------------------------------------------------------
