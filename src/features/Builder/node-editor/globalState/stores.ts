import create from "zustand";
import {
  coordinates,
  edge,
  edges,
  node,
  nodes,
  nodeTypes,
  portTypes,
} from "../types";
import produce from "immer";
import { merge } from "remeda";
import { devtools } from "zustand/middleware";

type EditorConfigBase = {
  zoom: number;
  coordinates: coordinates;
  config: [nodeTypes, portTypes];
  id: number;
};

export type EditorConfigUninitialized = EditorConfigBase & {
  initialized: false;
  runtimeData?: DOMRect;
};
export type EditorConfigInitialized = EditorConfigBase & {
  initialized: true;
  runtimeData: DOMRect;
};

export type EditorState = {
  editorConfig: EditorConfigUninitialized | EditorConfigInitialized;
  setEditorConfig: (editorConfig: Partial<EditorConfigBase>) => void;
  setRuntimeData: (runtimeData: DOMRect) => void;
};

export const useEditorStore = create<EditorState>(
  devtools(
    (set) => ({
      editorConfig: {
        zoom: 1,
        coordinates: [0, 0],
        initialized: false,
        config: [{}, {}],
        id: 1234,
      },
      setEditorConfig: (editorConfig) =>
        set(
          produce((state: EditorState) => {
            state.editorConfig = merge(state.editorConfig, editorConfig);
          })
        ),
      setRuntimeData: (runtimeData) =>
        set(
          produce((state: EditorState) => {
            state.editorConfig.runtimeData = runtimeData;
            state.editorConfig.initialized = true;
          })
        ),
    }),
    "Editor"
  )
);

export type NodesState = {
  nodes: nodes;
  setNodes: (nodes: nodes) => void;
  addNode: (node: node) => void;
  removeNode: (nodeId: string) => void;
  setNode: (node: node) => void;
};

export const useNodesStore = create<NodesState>(
  devtools(
    (set) => ({
      nodes: {},
      setNodes: (nodes) =>
        set({
          nodes: Object.entries(nodes).reduce((acc: nodes, node) => {
            acc[node[0]] = { ...node[1], dragging: false };
            return acc;
          }, {}),
        }),
      addNode: (node) => set((state) => ({ ...state, node })),
      removeNode: (nodeId) =>
        set(
          produce((state: NodesState) => {
            delete state.nodes[nodeId];
          })
        ),
      setNode: (node) =>
        set(
          produce((state: NodesState) => {
            state.nodes[node.id] = node;
          })
        ),
    }),
    "Nodes"
  )
);

export type EdgesState = {
  edges: edges;
  setEdges: (edges: edges) => void;
  setEdgeData: (
    data: Partial<edge>,
    originNodeId: string,
    destinationNodeId: string
  ) => void;
};

export const useEdgesStore = create<EdgesState>(
  devtools(
    (set) => ({
      edges: {},
      setEdges: (edges) => set({ edges }),
      setEdgeData: (data, originNodeId, destinationNodeId) =>
        set(
          produce((state: EdgesState) => {
            const edge = state.edges[originNodeId].find(
              (edge) => edge.nodeId === destinationNodeId
            );
            const edgeIndex = state.edges[originNodeId].findIndex(
              (edge) => edge.nodeId === destinationNodeId
            );

            if (edgeIndex && edge)
              state.edges[originNodeId][edgeIndex] = { ...edge, ...data };
          })
        ),
    }),
    "Edges"
  )
);
