import produce from "immer";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { coordinates, node, nodes, nodeTypes, portTypes } from "../types";

export type NodesState = {
  nodes: nodes;
  nodeTypes: nodeTypes;
  portTypes: portTypes;
  setNodes: (nodes: nodes, nodeTypes: nodeTypes, portTypes: portTypes) => void;
  addNode: (nodeType: string, coordinates: coordinates, id: string) => void;
  removeNode: (nodeId: string) => void;
  setNode: (id: string, node: node) => void;
};

export const useNodesStore = create<NodesState>(
  devtools(
    (set) => ({
      nodes: {},
      nodeTypes: {},
      portTypes: {},
      setNodes: (nodes, nodeTypes, portTypes) =>
        set({
          nodes: Object.entries(nodes).reduce((acc: nodes, node) => {
            acc[node[0]] = { ...node[1] };
            return acc;
          }, {}),
          nodeTypes,
          portTypes,
        }),
      addNode: (nodeType, coordinates, id) =>
        set(
          produce((state: NodesState) => {
            state.nodes[id] = {
              coordinates,
              type: nodeType,
              width: 250,
              height: 100,
            };
          })
        ),
      removeNode: (nodeId) =>
        set(
          produce((state: NodesState) => {
            delete state.nodes[nodeId];
          })
        ),
      setNode: (id, node) =>
        set(
          produce((state: NodesState) => {
            state.nodes[id] = node;
          })
        ),
    }),
    "Nodes"
  )
);
