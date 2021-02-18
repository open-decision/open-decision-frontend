import create from "zustand";
import produce, { current } from "immer";
import { edge, edges } from "../types";
import { devtools } from "zustand/middleware";

export type EdgesState = {
  /**
   * The data about all the edges between nodes in the editor.
   */
  edges: edges;
  newEdge: { target?: string };
  /**
   * The initializer function. Provide the edges data to fill the store.
   */
  setEdges: (edges: edges) => void;
  /**
   * Updates the data of an individual edge.
   * @param data - The properties of an edge object to update. Will be merged with the existing data.
   * @param inputNodeId - The id of the node with the **input** port of the connection.
   * @param outputNodeId - The id of the node with the **ouput** port of the connection.
   */
  updateEdge: (
    data: Partial<edge>,
    inputNodeId: string,
    outputNodeId: string
  ) => void;
  /**
   * Adds a new edge to the store.
   * @param inputNodeId - The id of the node with the **input** port of the connection.
   * @param outputNodeId - The id of the node with the **ouput** port of the connection.
   */
  addEdge: (origin: string, destination?: string) => void;
  removeEdge: (inputNodeId: string, outputNodeId: string) => void;
  updateEdgeTarget: (id: string) => void;
  removeEdgeTarget: () => void;
};

/**
 * The global store for the edges. It needs to be provided with edges and has no default data.
 */
export const useEdgesStore = create<EdgesState>(
  devtools(
    (set) => ({
      edges: {},
      newEdge: { target: undefined },
      setEdges: (edges) => set({ edges }),
      updateEdge: (data, originNodeId, destinationNodeId) =>
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
      addEdge: (origin, destination) =>
        set(
          produce((state: EdgesState) => {
            const targetNodeId = destination ?? state.newEdge.target;
            if (!targetNodeId) return;

            if (!state.edges[targetNodeId]) state.edges[targetNodeId] = [];

            const existingConnection = state.edges[targetNodeId].find(
              (edge) => edge.nodeId === origin
            );

            if (!existingConnection)
              state.edges[targetNodeId].push({
                nodeId: origin,
              });
          })
        ),
      removeEdge: (originNodeId, destinationNodeId) =>
        set(
          produce((state: EdgesState) => {
            const connections = state.edges[originNodeId];

            const edgeToDelete = connections.findIndex(
              (value) => value.nodeId === destinationNodeId
            );

            connections.splice(edgeToDelete, 1);
          })
        ),
      updateEdgeTarget: (id) =>
        set(
          produce((state: EdgesState) => {
            state.newEdge.target = id;
          })
        ),
      removeEdgeTarget: () =>
        set(
          produce((state: EdgesState) => {
            state.newEdge.target = undefined;
          })
        ),
    }),
    "Edges"
  )
);
