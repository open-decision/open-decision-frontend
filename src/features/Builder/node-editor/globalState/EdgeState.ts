import create from "zustand";
import produce from "immer";
import { edge, edges } from "../types";
import { devtools } from "zustand/middleware";

export type EdgesState = {
  /**
   * The data about all the edges between nodes in the editor.
   */
  edges: edges;
  newConnectionInCreation: boolean;
  connectionTarget?: string;
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
  addEdge: (output: string, input?: string) => void;
  removeEdge: (inputNodeId: string, outputNodeId: string) => void;
  startNewEdgeCreation: () => void;
  updateEdgeTarget: (id: string) => void;
  removeEdgeTarget: () => void;
  endNewEdgeCreation: () => void;
};

/**
 * The global store for the edges. It needs to be provided with edges and has no default data.
 */
export const useEdgesStore = create<EdgesState>(
  devtools(
    (set) => ({
      edges: {},
      newConnectionInCreation: false,
      connectionTarget: undefined,
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
      addEdge: (outputNodeId, inputNodeId) =>
        set(
          produce((state: EdgesState) => {
            const targetNodeId = inputNodeId ?? state.connectionTarget;

            //Stop Nodes from being connected to itself.
            if (targetNodeId === outputNodeId) return;
            //Delete Connections when they have no target.
            if (!targetNodeId) return;

            //Create an empty array for the output nodes connections if their is not already data.
            if (!state.edges[outputNodeId]) state.edges[outputNodeId] = [];

            //Find a possible existing connection between the two Nodes.
            const existingConnection = state.edges[outputNodeId].find(
              (edge) => edge.nodeId === targetNodeId
            );

            //Only add the new connection when their is not an existing connection between them.
            if (!existingConnection)
              state.edges[outputNodeId].push({
                nodeId: targetNodeId,
              });
          })
        ),
      removeEdge: (inputNodeId, outputNodeId) =>
        set(
          produce((state: EdgesState) => {
            const connections = state.edges[inputNodeId];

            const edgeToDelete = connections.findIndex(
              (value) => value.nodeId === outputNodeId
            );

            connections.splice(edgeToDelete, 1);
          })
        ),
      startNewEdgeCreation: () => set({ newConnectionInCreation: true }),
      updateEdgeTarget: (id) =>
        set((state) => ({
          connectionTarget: state.newConnectionInCreation ? id : undefined,
        })),
      removeEdgeTarget: () => set({ connectionTarget: undefined }),
      endNewEdgeCreation: () => set({ newConnectionInCreation: false }),
    }),
    "Edges"
  )
);
