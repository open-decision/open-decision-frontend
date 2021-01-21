import {
  Comments,
  Connection,
  coordinates,
  Nodes,
  NodeTypes,
  PortTypes,
  Connections,
} from "../types";
import { checkForCircularNodes } from "../utilities";
import produce, { Draft } from "immer";
import { nanoid } from "nanoid/non-secure";
import {
  deleteConnection,
  deleteConnectionsByNodeId,
} from "../utilities/connections/existingConnections";
import { edges } from "../tests/nodes";
import {
  connectionCoordinates,
  connectionPorts,
} from "../utilities/connections/types";

export const getConnectionCoordinates = (
  zoom: number,
  connectionPorts: connectionPorts,
  stageRect: React.MutableRefObject<DOMRect>,
  portHalf: number,
  stageCoordinates: coordinates
): connectionCoordinates => {
  const byScale = (value: number) => (1 / zoom) * value;
  const [originPort, destinationPort] = connectionPorts;

  const destination: coordinates = [
    byScale(
      destinationPort.x -
        stageRect.current.x +
        (portHalf - stageRect.current.width / 2)
    ) - byScale(stageCoordinates[0]),
    byScale(
      destinationPort.y -
        stageRect.current.y +
        (portHalf - stageRect.current.height / 2)
    ) - byScale(stageCoordinates[1]),
  ];

  const origin: coordinates = [
    byScale(
      originPort.x -
        stageRect.current.x +
        portHalf -
        stageRect.current.width / 2
    ) - byScale(stageCoordinates[0]),
    byScale(
      originPort.y -
        stageRect.current.y +
        portHalf -
        stageRect.current.height / 2
    ) - byScale(stageCoordinates[1]),
  ];

  return [origin, destination];
};

const removeConnection = produce(
  (nodes: Draft<Nodes>, input: Connection, output: Connection) => {
    //Lookup the connected nodes
    const inputNode = nodes[input.nodeId];
    const outputNode = nodes[output.nodeId];

    //remove the input from the inputNode
    inputNode.connections.inputs[input.portName] = [];

    outputNode.connections.outputs[output.portName].filter((cnx) => {
      return cnx.nodeId === input.nodeId
        ? cnx.portName !== input.portName
        : true;
    });
  }
);

/**Connections are referencing other nodes by their unique id. When nodes are removed all connections need to be removed aswell. */
const removeConnectionsById = produce(
  (connections: Draft<Connections>, nodeId: string) => {
    Object.values(connections).map((connection) =>
      connection.filter((connection) => connection.nodeId !== nodeId)
    );
  }
);

export type editorActions =
  | { type: "SET_SCALE"; zoom: number }
  | { type: "SET_TRANSLATE"; coordinates: coordinates }
  | {
      type: "ADD_CONNECTION";
      input: Connection;
      output: Connection;
    }
  | { type: "INITIALIZE" }
  | { type: "REMOVE_CONNECTION"; input: Connection; output: Connection }
  | { type: "DESTROY_TRANSPUT"; transput: Connection; transputType: string }
  | {
      type: "ADD_NODE";
      coordinates: coordinates;
      nodeType: string;
      id?: string;
      width?: number;
      root?: boolean;
    }
  | { type: "REMOVE_NODE"; nodeId: string }
  | {
      type: "SET_PORT_DATA";
      nodeId: string;
      portName: string;
      controlName: string;
      data: any;
    }
  | {
      type: "SET_NODE_COORDINATES";
      nodeId: string;
      coordinates: coordinates;
      nodeRuntimeData: DOMRect;
    }
  | {
      type: "ADD_NODE_RUNTIME_DATA";
      nodeRuntimeData: DOMRect;
      id: string;
    }
  | {
      type: "ADD_EDGES_RUNTIME_DATA";
      stageRect: React.MutableRefObject<DOMRect | null>;
    }
  | {
      type: "ADD_COMMENT";
      coordinates: coordinates;
    }
  | { type: "SET_COMMENT_COORDINATES"; id: string; coordinates: coordinates }
  | {
      type: "SET_COMMENT_DIMENSIONS";
      id: string;
      width: number;
      height: number;
    }
  | { type: "SET_COMMENT_TEXT"; id: string; text: string }
  | { type: "SET_COMMENT_COLOR"; id: string; color: string }
  | { type: "DELETE_COMMENT"; id: string };

export type EditorState = {
  /**
   * The id of the Editor.
   */
  id: string;
  /**
   * The current zoom level.
   */
  zoom: number;
  /**
   * The current position of the Editor.
   */
  coordinates: coordinates;
  /**
   * The currently shown Nodes.
   */
  nodes: Nodes;
  /**
   * The currently shown Nodes.
   */
  edges: edges;
  /**
   * The currently shown Comments.
   */
  comments: Comments;
  /**
   * The preconfigured avaliable NodeTypes and PortTypes that can be added when using the node-editor.
   */
  config: [NodeTypes, PortTypes];
};

export const editorReducer = (
  circularBehavior: "warn" | "prevent" | "allow",
  dispatchToasts?: any
) =>
  produce((draft: EditorState, action: editorActions) => {
    switch (action.type) {
      case "SET_SCALE":
        draft.zoom = action.zoom;
        break;

      case "SET_TRANSLATE":
        draft.coordinates = action.coordinates;
        break;

      case "ADD_NODE": {
        const { coordinates, nodeType, id, width } = action;

        const newNodeId = id || nanoid(10);

        draft.nodes[newNodeId] = {
          id: newNodeId,
          coordinates,
          type: nodeType,
          width: width ? width : 200,
        };
        break;
      }

      case "ADD_NODE_RUNTIME_DATA": {
        draft.nodes[action.id].runtimeData = action.nodeRuntimeData;
        break;
      }

      case "ADD_EDGES_RUNTIME_DATA": {
        const edges = draft.edges;

        for (const node in edges) {
          const originNode = draft.nodes[node]?.runtimeData;

          edges[node].forEach((edge) => {
            const destinationNode = draft.nodes[edge.nodeId]?.runtimeData;

            if (originNode && destinationNode) {
              edge.connectionCoordinates = getConnectionCoordinates(
                draft.zoom,
                [originNode, destinationNode],
                action.stageRect,
                6,
                draft.coordinates
              );
            }
          });
        }
        break;
      }

      case "REMOVE_NODE": {
        const { nodeId } = action;
        delete draft.nodes[nodeId];
        Object.values(draft.nodes).map((node) => {
          node.connections.inputs = removeConnectionsById(
            node.connections.inputs,
            nodeId
          );

          node.connections.outputs = removeConnectionsById(
            node.connections.outputs,
            nodeId
          );
        });

        //This is a side effect that actually removes the connections from the DOM
        deleteConnectionsByNodeId(nodeId);

        break;
      }

      case "ADD_CONNECTION": {
        const { input, output } = action;

        //This checks whether the receiving input is already connected. A new connection can only be added when the receiving port is not already connected.
        const receivingInput =
          draft.nodes[input.nodeId].connections.inputs[input.portName];

        if (receivingInput.length === 0) {
          const allowCircular =
            circularBehavior === "warn" || circularBehavior === "allow";

          draft.nodes[input.nodeId].connections.inputs[input.portName].push({
            nodeId: output.nodeId,
            portName: output.portName,
          });

          draft.nodes[output.nodeId].connections.outputs[output.portName].push({
            nodeId: input.nodeId,
            portName: input.portName,
          });

          const isCircular = checkForCircularNodes(draft.nodes, output.nodeId);

          if (isCircular && !allowCircular) {
            dispatchToasts({
              type: "ADD_TOAST",
              title: "Unable to connect",
              message:
                "Connecting these nodes would result in an infinite loop.",
              toastType: "warning",
              duration: 5000,
            });
          } else if (isCircular && circularBehavior === "warn") {
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

        draft.nodes = removeConnection(draft.nodes, input, output);
        deleteConnection(id);
        break;
      }

      case "DESTROY_TRANSPUT": {
        const { transput, transputType } = action;

        const connectionType = transputType === "input" ? "inputs" : "outputs";

        const connections =
          draft.nodes[transput.nodeId].connections[connectionType][
            transput.portName
          ];

        if (!connections || !connections.length) break;

        connections.reduce((nodes, cnx) => {
          const [input, output] =
            transputType === "input" ? [transput, cnx] : [cnx, transput];

          const id =
            output.nodeId + output.portName + input.nodeId + input.portName;

          deleteConnection(id);

          return removeConnection(nodes, input, output);
        }, draft.nodes);

        break;
      }

      case "SET_NODE_COORDINATES": {
        const { coordinates, nodeId, nodeRuntimeData } = action;

        draft.nodes[nodeId].coordinates = coordinates;
        draft.nodes[nodeId].runtimeData = nodeRuntimeData;
        break;
      }

      case "ADD_COMMENT":
        draft.comments[nanoid(10)] = {
          id: nanoid(10),
          text: "",
          coordinates: action.coordinates,
          width: 200,
          height: 30,
          color: "blue",
        };
        break;

      case "SET_COMMENT_COORDINATES":
        draft.comments[action.id].coordinates = action.coordinates;
        break;

      case "SET_COMMENT_DIMENSIONS":
        draft.comments[action.id].width = action.width;
        draft.comments[action.id].height = action.height;
        break;

      case "SET_COMMENT_TEXT":
        draft.comments[action.id].text = action.text;
        break;

      case "SET_COMMENT_COLOR":
        draft.comments[action.id].color = action.color;
        break;

      case "DELETE_COMMENT":
        delete draft.comments[action.id];
        break;
    }
  });
