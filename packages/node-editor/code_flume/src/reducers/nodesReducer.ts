import {
  deleteConnection,
  deleteConnectionsByNodeId,
} from "../connectionCalculator";
import { checkForCircularNodes } from "../utilities";
import { nanoid } from "nanoid/non-secure";
import {
  nodes,
  Node,
  Connection,
  connection,
  PortTypes,
  NodeTypes,
  defaultNode,
  NodeConfig,
} from "@globalTypes/types";
import produce, { original } from "immer";

const removeConnection = produce(
  (nodes: nodes, input: Connection, output: Connection) => {
    //Lookup the connected nodes
    const inputNode = nodes[input.nodeId];
    const outputNode = nodes[output.nodeId];

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
  }
);

const reconcileNodes = (
  nodes: nodes,
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
  context: any
) => {
  const deleteNode = (nodeId: string) =>
    nodesReducer({ nodeTypes, portTypes, context })(nodes, {
      type: "REMOVE_NODE",
      nodeId,
    });

  // Delete extraneous nodes
  Object.values(nodes).map((node) =>
    !nodeTypes[node.type] ? deleteNode(node.id) : undefined
  );

  // Reconcile input data for each node
  let reconciledNodes: nodes = Object.values(nodes).reduce(
    (nodesObj: nodes, node) => {
      const nodeType = nodeTypes[node.type];

      const defaultInputData = getDefaultData({
        node,
        nodeType,
        portTypes,
        context,
      });

      const currentInputData = Object.entries(node.inputData).reduce(
        (obj: any, [key, data]) => {
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
    },
    {}
  );

  // Reconcile node attributes for each node
  reconciledNodes = Object.values(reconciledNodes).reduce(
    (nodesObj: nodes, node) => {
      const newNode = { ...node };
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
    },
    {}
  );

  return reconciledNodes;
};

export const getInitialNodes = (
  initialNodes: nodes = {},
  defaultNodes: defaultNode[] = [],
  nodeTypes: NodeTypes,
  portTypes: PortTypes,
  context: unknown
): nodes => {
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
        nodes = nodesReducer({ nodeTypes, portTypes, context })(nodes, {
          type: "ADD_NODE",
          id: `default-${i}`,
          defaultNode: true,
          x: dNode.x || 0,
          y: dNode.y || 0,
          nodeType: dNode.type,
        });
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
  nodeType: NodeConfig;
  portTypes: PortTypes;
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
    }
  | { type: "SET_NODE_COORDINATES"; nodeId: string; x: number; y: number };

type config = {
  nodeTypes: NodeTypes;
  portTypes: PortTypes;
  cache?: any;
  circularBehavior?: string;
  context?: any;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nodesReducer = (config: config, dispatchToasts?: any) =>
  produce((draft: nodes, action: nodesActions) => {
    switch (action.type) {
      case "ADD_CONNECTION": {
        const { input, output } = action;

        //This checks whether the receiving input is already connected. A new connection can only be added when the receiving port is not already connected.
        const inputIsNotConnected = !draft[input.nodeId].connections.inputs[
          input.portName
        ];

        if (inputIsNotConnected) {
          const allowCircular =
            config.circularBehavior === "warn" ||
            config.circularBehavior === "allow";

          const connections = draft[output.nodeId].connections;

          connections.inputs[input.portName].push({
            nodeId: output.nodeId,
            portName: output.portName,
          });

          connections.outputs[output.portName].push({
            nodeId: input.nodeId,
            portName: input.portName,
          });

          const isCircular = checkForCircularNodes(draft, output.nodeId);

          if (isCircular && !allowCircular) {
            dispatchToasts({
              type: "ADD_TOAST",
              title: "Unable to connect",
              message:
                "Connecting these nodes would result in an infinite loop.",
              toastType: "warning",
              duration: 5000,
            });
            return original(draft);
          } else if (isCircular && config.circularBehavior === "warn") {
            dispatchToasts({
              type: "ADD_TOAST",
              title: "Circular Connection Detected",
              message: "Connecting these nodes has created an infinite loop.",
              toastType: "warning",
              duration: 5000,
            });
          }
        }
        break;
      }

      case "REMOVE_CONNECTION": {
        const { input, output } = action;
        const id =
          output.nodeId + output.portName + input.nodeId + input.portName;

        delete config.cache.current.connections[id];

        deleteConnection(id);
        removeConnection(draft, input, output);
        break;
      }

      case "DESTROY_TRANSPUT": {
        const { transput, transputType } = action;
        const portId = transput.nodeId + transput.portName + transputType;

        delete config.cache.current.ports[portId];

        const connectionType = transputType === "input" ? "inputs" : "outputs";

        const connections =
          draft[transput.nodeId].connections[connectionType][transput.portName];

        if (!connections || !connections.length) break;

        connections.reduce((draft, cnx) => {
          const [input, output] =
            transputType === "input" ? [transput, cnx] : [cnx, transput];

          const id =
            output.nodeId + output.portName + input.nodeId + input.portName;

          delete config.cache.current.connections[id];

          deleteConnection(id);

          return removeConnection(draft, input, output);
        }, draft);

        break;
      }

      case "ADD_NODE": {
        const { x, y, nodeType, id, defaultNode } = action;

        const newNodeId = id || nanoid(10);

        draft[newNodeId] = {
          id: newNodeId,
          x,
          y,
          type: nodeType,
          width: config.nodeTypes[nodeType].initialWidth || 200,
          connections: {
            inputs: {},
            outputs: {},
          },
          inputData: getDefaultData({
            node: draft[newNodeId],
            nodeType: config.nodeTypes[nodeType],
            portTypes: config.portTypes,
            context: config.context,
          }),
          defaultNode: defaultNode ? true : false,
          root: config.nodeTypes[nodeType].root ? true : false,
        };
        break;
      }

      case "REMOVE_NODE": {
        const { nodeId } = action;
        delete draft[nodeId];

        draft = Object.values(draft).reduce((obj: nodes, node) => {
          obj[node.id] = {
            ...node,
            connections: {
              inputs: getFilteredTransputs(node.connections.inputs, nodeId),
              outputs: getFilteredTransputs(node.connections.outputs, nodeId),
            },
          };

          return obj;
        }, {});

        const getFilteredTransputs = (
          transputs: connection,
          nodeId: string
        ): connection =>
          Object.entries(transputs).reduce(
            (obj: connection, [portName, transput]) => {
              const newTransputs = transput.filter((t) => t.nodeId !== nodeId);

              if (newTransputs.length) {
                obj[portName] = newTransputs;
              }

              return obj;
            },
            {}
          );

        //This is a side effect that actually removes the connections from the DOM
        deleteConnectionsByNodeId(nodeId);

        break;
      }

      case "HYDRATE_DEFAULT_NODES": {
        for (const key in draft) {
          if (draft[key].defaultNode) {
            const newNodeId = nanoid(10);

            draft[newNodeId].id = newNodeId;
            delete draft[newNodeId].defaultNode;
            delete draft[key];
          }
        }

        break;
      }

      case "SET_PORT_DATA": {
        const { nodeId, portName, controlName, data } = action;

        draft[nodeId].inputData[portName][controlName] = data;
        break;
      }

      case "SET_NODE_COORDINATES": {
        const { x, y, nodeId } = action;
        draft[nodeId].x = x;
        draft[nodeId].y = y;
        break;
      }
    }
  });
