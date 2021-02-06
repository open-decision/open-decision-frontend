import { EdgesState } from "../../globalState/stores";
import { edge } from "../../types";

export const getInputConnections = (id: string) => (
  state: EdgesState
): edge[] => state.edges[id];

export const getOutputConnections = (id: string) => (
  state: EdgesState
): edge[] =>
  Object.values(state.edges).reduce((acc: edge[], edgesArray) => {
    const connection = edgesArray.find((edge) => edge.nodeId === id);

    if (connection) acc.push(connection);

    return acc;
  }, []);
