import {
  Comments,
  Connection,
  coordinates,
  Nodes,
  NodeTypes,
  PortTypes,
} from "../types";
import {
  checkForCircularNodes,
  deleteConnection,
  deleteConnectionsByNodeId,
} from "../utilities";
import produce, { Draft, original } from "immer";
import { nanoid } from "nanoid/non-secure";

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

export type editorActions =
  | { type: "SET_SCALE"; zoom: number }
  | { type: "SET_TRANSLATE"; position: coordinates }
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
  | { type: "SET_NODE_COORDINATES"; nodeId: string; x: number; y: number }
  | {
      type: "ADD_COMMENT";
      x: number;
      y: number;
    }
  | { type: "REMOVE_COMMENT_NEW"; id: string }
  | { type: "SET_COMMENT_COORDINATES"; id: string; x: number; y: number }
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
  readonly id: string;
  /**
   * The current zoom level.
   */
  readonly zoom: number;
  /**
   * The current position of the Editor.
   */
  readonly position: coordinates;
  /**
   * The currently shown Nodes.
   */
  readonly nodes: Nodes;
  /**
   * The currently shown Comments.
   */
  readonly comments: Comments;
  /**
   * The preconfigured avaliable NodeTypes and PortTypes that can be added when using the node-editor.
   */
  readonly config: [NodeTypes, PortTypes];
};

export const editorReducer = (
  circularBehavior: "warn" | "prevent" | "allow",
  dispatchToasts?: any
) =>
  produce((draft: Draft<EditorState>, action: editorActions) => {
    switch (action.type) {
      case "SET_SCALE":
        draft.zoom = action.zoom;
        break;

      case "SET_TRANSLATE":
        draft.position = action.position;
        break;

      case "ADD_NODE": {
        const { x, y, nodeType, id, width, root } = action;

        const newNodeId = id || nanoid(10);

        draft.nodes[newNodeId] = {
          id: newNodeId,
          coordinates: { x, y },
          type: nodeType,
          width: width ? width : 200,
          connections: {
            inputs: {},
            outputs: {},
          },
          root: root ? root : false,
        };
        break;
      }

      case "REMOVE_NODE": {
        const { nodeId } = action;
        delete draft.nodes[nodeId];

        draft.nodes = Object.values(draft.nodes).reduce(
          (obj: Draft<Nodes>, node) => {
            obj[node.id] = {
              ...node,
              connections: {
                inputs: removeConnectionsById(node.connections.inputs, nodeId),
                outputs: removeConnectionsById(
                  node.connections.outputs,
                  nodeId
                ),
              },
            };

            return obj;
          },
          {}
        );

        /**Connections are referencing other nodes by their unique id. When nodes are removed all connections need to be removed aswell. */
        const removeConnectionsById = (
          connection: Draft<connection>,
          nodeId: string
        ) =>
          Object.entries(connection).reduce(
            (obj: Draft<connection>, [portName, transput]) => {
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
        const { x, y, nodeId } = action;
        draft.nodes[nodeId].coordinates = { x, y };
        break;
      }

      case "ADD_COMMENT":
        draft.comments[nanoid(10)] = {
          id: nanoid(10),
          text: "",
          coordinates: { x: action.x, y: action.y },
          width: 200,
          height: 30,
          color: "blue",
        };
        break;

      case "REMOVE_COMMENT_NEW":
        delete draft.comments[action.id].isNew;
        break;

      case "SET_COMMENT_COORDINATES":
        draft.comments[action.id].coordinates = { x: action.x, y: action.y };
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
