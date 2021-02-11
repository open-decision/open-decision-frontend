import create from "zustand";
import produce from "immer";
import { edge, edges } from "../types";
import { devtools } from "zustand/middleware";

export type EdgesState = {
  edges: edges;
  setEdges: (edges: edges) => void;
  setEdgeData: (
    data: Partial<edge>,
    originNodeId: string,
    destinationNodeId: string
  ) => void;
  addEdge: (originNodeId: string, destinationNodeId: string) => void;
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
      addEdge: (originNodeId, destinationNodeId) =>
        set(
          produce((state: EdgesState) => {
            if (!state.edges[originNodeId]) state.edges[originNodeId] = [];

            state.edges[originNodeId].push({
              nodeId: destinationNodeId,
            });
          })
        ),
    }),
    "Edges"
  )
);
