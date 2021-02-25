import produce from "immer";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { coordinates, node, nodes, nodeTypes, portTypes } from "../types";
import { merge } from "remeda";

export type NodesState = {
  nodes: nodes;
  nodeTypes: nodeTypes;
  portTypes: portTypes;
  setNodes: (nodes: nodes, nodeTypes: nodeTypes, portTypes: portTypes) => void;
  addNode: (nodeType: string, coordinates: coordinates, id: string) => void;
  removeNode: (nodeId: string) => void;
  setNode: (id: string, node: Partial<node>) => void;
};

export const useNodesStore = create<NodesState>(
  devtools(
    (set) => ({
      nodes: {},
      nodeTypes: {},
      portTypes: {},
      /**
       * Sets the state initially based on the passed in arguments.
       */
      setNodes: (nodes, nodeTypes, portTypes) =>
        set({
          nodes,
          nodeTypes,
          portTypes,
        }),
      /**
       * Adds a Node of a specific type.
       * @param nodeType - One of the available nodeTypes.
       * @param coordinates - The coordinates where the new Node should be created.
       * @param id - The id of the new Node.
       */
      addNode: (nodeType, coordinates, id) =>
        set(
          produce((state: NodesState) => {
            const { width, height } = state.nodeTypes[nodeType];

            state.nodes[id] = {
              coordinates,
              type: nodeType,
              width: width,
              height: height,
              name: "",
            };
          })
        ),
      /**
       * Deletes an existing Node.
       * @param id - The id of the Node that should be deleted.
       */
      removeNode: (id) =>
        set(
          produce((state: NodesState) => {
            delete state.nodes[id];
          })
        ),
      /**
       * Updates an existing Node with a new Node object.
       * @param id Id of the Node that should be edited.
       * @param node The new Node data.
       */
      setNode: (id, node) =>
        set(
          produce((state: NodesState) => {
            state.nodes[id] = merge(state.nodes[id], node);
          })
        ),
    }),
    "Nodes"
  )
);
