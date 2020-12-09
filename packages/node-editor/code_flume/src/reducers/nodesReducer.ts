//FIXME File needs to be salvaged
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
  ControlConfigs,
} from "@globalTypes/types";
import produce, { original } from "immer";

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

  return inputs.reduce((obj: any, input) => {
    const inputType = portTypes[input.type];

    obj[input.name || inputType.name] = (
      input.controls ||
      inputType.controls ||
      []
    ).reduce((obj2: { [id: string]: unknown }, control) => {
      if ("defaultValue" in control) {
        obj2[control.name] = control.defaultValue;
      }

      return obj2;
    }, {});

    return obj;
  }, {});
};
