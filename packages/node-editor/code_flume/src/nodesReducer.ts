import {
  deleteConnection,
  deleteConnectionsByNodeId,
} from "./connectionCalculator";
import { checkForCircularNodes } from "./utilities";
import nanoid from "nanoid/non-secure/index";
import {
  nodes,
  Node,
  Connection,
  connections,
  connection,
  NodeType,
  PortTypes,
  NodeTypes,
  defaultNode,
} from "./types";
import produce from "immer";

const addConnection = (nodes: nodes, input: Connection, output: Connection) =>
  produce(nodes, (draft) => {
    const connections = draft[output.nodeId].connections;

    connections.inputs[input.portName].push({
      nodeId: output.nodeId,
      portName: output.portName,
    });

    connections.outputs[output.portName].push({
      nodeId: input.nodeId,
      portName: input.portName,
    });
  });

const removeConnection = (
  nodes: nodes,
  input: Connection,
  output: Connection
) =>
  produce(nodes, (draft) => {
    //Lookup the connected nodes
    const inputNode = draft[input.nodeId];
    const outputNode = draft[output.nodeId];

    //remove the input from the inputNode
    delete inputNode.connections.inputs[input.portName];

    const filteredOutputNodes = outputNode.connections.outputs[
      output.portName
    ].filter((cnx) => {
      return cnx.nodeId === input.nodeId
        ? cnx.portName !== input.portName
        : true;
    });

    outputNode.connections.outputs[output.portName] = filteredOutputNodes;
  });

const getFilteredTransputs = (transputs: connection, nodeId: string): nodes =>
  Object.entries(transputs).reduce((obj, [portName, transput]) => {
    const newTransputs = transput.filter((t) => t.nodeId !== nodeId);
    if (newTransputs.length) {
      obj[portName] = newTransputs;
    }

    return obj;
  }, {});

const removeConnections = (connections: connections, nodeId: string) => ({
  inputs: getFilteredTransputs(connections.inputs, nodeId),
  outputs: getFilteredTransputs(connections.outputs, nodeId),
});

const removeNode = produce((draft: nodes, nodeId: string) => {
  delete draft[nodeId];

  draft = Object.values(draft).reduce((obj, node) => {
    obj[node.id] = {
      ...node,
      connections: removeConnections(node.connections, nodeId),
    };

    return obj;
  }, {});

  //This is a side effect that actually removes the connections from the DOM
  deleteConnectionsByNodeId(nodeId);
});

const reconcileNodes = (
  nodes: nodes,
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
  context: any
) => {
  const deleteNode = (nodeId: string) =>
    nodesReducer(
      nodes,
      { type: "REMOVE_NODE", nodeId },
      { nodeTypes, portTypes, context }
    );

  // Delete extraneous nodes
  Object.values(nodes).map((node) =>
    !nodeTypes[node.type] ? deleteNode(node.id) : undefined
  );

  // Reconcile input data for each node
  let reconciledNodes: nodes = Object.values(nodes).reduce((nodesObj, node) => {
    const nodeType = nodeTypes[node.type];

    const defaultInputData = getDefaultData({
      node,
      nodeType,
      portTypes,
      context,
    });

    const currentInputData = Object.entries(node.inputData).reduce(
      (obj, [key, data]) => {
        if (defaultInputData[key] !== undefined) obj[key] = data;
        return obj;
      },
      {}
    );

    const newInputData = {
      ...defaultInputData,
      ...currentInputData,
    };

    nodesObj[node.id] = {
      ...node,
      inputData: newInputData,
    };

    return nodesObj;
  }, {});

  // Reconcile node attributes for each node
  reconciledNodes = Object.values(reconciledNodes).reduce((nodesObj, node) => {
    let newNode = { ...node };
    const nodeType = nodeTypes[node.type];

    if (nodeType.root !== node.root) {
      if (nodeType.root && !node.root) {
        newNode.root = nodeType.root;
      } else if (!nodeType.root && node.root) {
        delete newNode.root;
      }
    }
    nodesObj[node.id] = newNode;
    return nodesObj;
  }, {});

  return reconciledNodes;
};

export const getInitialNodes = (
  initialNodes: nodes = {},
  defaultNodes: defaultNode[] = [],
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
  context: any
) => {
  const reconciledNodes = reconcileNodes(
    initialNodes,
    nodeTypes,
    portTypes,
    context
  );

  return {
    ...reconciledNodes,
    ...defaultNodes.reduce((nodes, dNode, i) => {
      const nodeNotAdded = !Object.values(initialNodes).find(
        (n) => n.type === dNode.type
      );

      if (nodeNotAdded) {
        nodes = nodesReducer(
          nodes,
          {
            type: "ADD_NODE",
            id: `default-${i}`,
            defaultNode: true,
            x: dNode.x || 0,
            y: dNode.y || 0,
            nodeType: dNode.type,
          },
          { nodeTypes, portTypes, context }
        );
      }
      return nodes;
    }, {}),
  };
};

const getDefaultData = ({
  node,
  nodeType,
  portTypes,
  context,
}: {
  node: Node;
  nodeType: any;
  portTypes: any;
  context: any;
}) => {
  const inputs = Array.isArray(nodeType.inputs)
    ? nodeType.inputs
    : nodeType.inputs(node.inputData, node.connections, context);

  return inputs.reduce((obj, input) => {
    const inputType = portTypes[input.type];

    obj[input.name || inputType.name] = (
      input.controls ||
      inputType.controls ||
      []
    ).reduce((obj2, control) => {
      obj2[control.name] = control.defaultValue;
      return obj2;
    }, {});

    return obj;
  }, {});
};

export type nodesActions =
  | {
      type: "ADD_CONNECTION";
      input: Connection;
      output: Connection;
    }
  | { type: "REMOVE_CONNECTION"; input: Connection; output: Connection }
  | { type: "DESTROY_TRANSPUT"; transput: Connection; transputType: string }
  | {
      type: "ADD_NODE";
      x: number;
      y: number;
      nodeType: string;
      id?: string;
      defaultNode?: boolean;
    }
  | { type: "REMOVE_NODE"; nodeId: string }
  | { type: "HYDRATE_DEFAULT_NODES"; nodeId?: string }
  | {
      type: "SET_PORT_DATA";
      nodeId: string;
      portName: string;
      controlName: string;
      data: any;
      setValue: any;
    }
  | { type: "SET_NODE_COORDINATES"; nodeId: string; x: number; y: number };

const nodesReducer = (
  nodes: nodes,
  action: nodesActions,
  {
    nodeTypes,
    portTypes,
    cache,
    circularBehavior,
    context,
  }: {
    nodeTypes: NodeTypes;
    portTypes: PortTypes;
    cache?: any;
    circularBehavior?: string;
    context: any;
  },
  dispatchToasts?
) => {
  switch (action.type) {
    case "ADD_CONNECTION": {
      const { input, output } = action;
      const inputIsNotConnected = !nodes[input.nodeId].connections.inputs[
        input.portName
      ];
      if (inputIsNotConnected) {
        const allowCircular =
          circularBehavior === "warn" || circularBehavior === "allow";
        const newNodes = addConnection(nodes, input, output);
        const isCircular = checkForCircularNodes(newNodes, output.nodeId);
        if (isCircular && !allowCircular) {
          dispatchToasts({
            type: "ADD_TOAST",
            title: "Unable to connect",
            message: "Connecting these nodes would result in an infinite loop.",
            toastType: "warning",
            duration: 5000,
          });
          return nodes;
        } else {
          if (isCircular && circularBehavior === "warn") {
            dispatchToasts({
              type: "ADD_TOAST",
              title: "Circular Connection Detected",
              message: "Connecting these nodes has created an infinite loop.",
              toastType: "warning",
              duration: 5000,
            });
          }
          return newNodes;
        }
      } else return nodes;
    }

    case "REMOVE_CONNECTION": {
      const { input, output } = action;
      const id =
        output.nodeId + output.portName + input.nodeId + input.portName;
      delete cache.current.connections[id];
      deleteConnection({ id });
      return removeConnection(nodes, input, output);
    }

    case "DESTROY_TRANSPUT": {
      const { transput, transputType } = action;
      const portId = transput.nodeId + transput.portName + transputType;
      delete cache.current.ports[portId];

      const cnxType = transputType === "input" ? "inputs" : "outputs";
      const connections =
        nodes[transput.nodeId].connections[cnxType][transput.portName];
      if (!connections || !connections.length) return nodes;

      return connections.reduce((nodes, cnx) => {
        const [input, output] =
          transputType === "input" ? [transput, cnx] : [cnx, transput];
        const id =
          output.nodeId + output.portName + input.nodeId + input.portName;
        delete cache.current.connections[id];
        deleteConnection({ id });
        return removeConnection(nodes, input, output);
      }, nodes);
    }

    case "ADD_NODE": {
      const { x, y, nodeType, id, defaultNode } = action;
      const newNodeId = id || nanoid(10);
      const newNode = {
        id: newNodeId,
        x,
        y,
        type: nodeType,
        width: nodeTypes[nodeType].initialWidth || 200,
        connections: {
          inputs: {},
          outputs: {},
        },
        inputData: {},
        defaultNode: false,
        root: false,
      };
      newNode.inputData = getDefaultData({
        node: newNode,
        nodeType: nodeTypes[nodeType],
        portTypes,
        context,
      });
      if (defaultNode) {
        newNode.defaultNode = true;
      }
      if (nodeTypes[nodeType].root) {
        newNode.root = true;
      }
      return {
        ...nodes,
        [newNodeId]: newNode,
      };
    }

    case "REMOVE_NODE": {
      const { nodeId } = action;
      return removeNode(nodes, nodeId);
    }

    case "HYDRATE_DEFAULT_NODES": {
      const newNodes = { ...nodes };
      for (const key in newNodes) {
        if (newNodes[key].defaultNode) {
          const newNodeId = nanoid(10);
          const { id, defaultNode, ...node } = newNodes[key];
          newNodes[newNodeId] = { ...node, id: newNodeId };
          delete newNodes[key];
        }
      }
      return newNodes;
    }

    case "SET_PORT_DATA": {
      const { nodeId, portName, controlName, data, setValue } = action;
      let newData = {
        ...nodes[nodeId].inputData,
        [portName]: {
          ...nodes[nodeId].inputData[portName],
          [controlName]: data,
        },
      };
      if (setValue) {
        newData = setValue(newData, nodes[nodeId].inputData);
      }
      return {
        ...nodes,
        [nodeId]: {
          ...nodes[nodeId],
          inputData: newData,
        },
      };
    }

    case "SET_NODE_COORDINATES": {
      const { x, y, nodeId } = action;
      return {
        ...nodes,
        [nodeId]: {
          ...nodes[nodeId],
          x,
          y,
        },
      };
    }

    default:
      return nodes;
  }
};

export const connectNodesReducer = (reducer, environment, dispatchToasts) => (
  state: nodes,
  action: nodesActions
): nodes => reducer(state, action, environment, dispatchToasts);

export default nodesReducer;
