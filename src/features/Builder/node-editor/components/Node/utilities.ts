import { EdgesState } from "../../globalState";
import { edge } from "../../types";

export const getOutputConnections = (id: string) => (
  state: EdgesState
): edge[] | undefined =>
  state.edges[id]?.length === 0 ? undefined : state.edges[id];

export const getInputConnections = (id: string) => (
  state: EdgesState
): edge[] =>
  Object.values(state.edges).reduce((acc: edge[], edgesArray) => {
    const connection = edgesArray.find((edge) => edge.nodeId === id);

    connection && acc.push(connection);

    return acc;
  }, []);
