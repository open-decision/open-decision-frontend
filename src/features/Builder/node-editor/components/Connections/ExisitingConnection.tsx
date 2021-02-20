import React from "react";
import { calculateCurve, getConnectionCoordinates } from "../../utilities";
import { NodesState, useEdgesStore, useNodesStore } from "../../globalState";
import { edge, nodePositionalData } from "../../types";
import shallow from "zustand/shallow";
import { Connection } from "./Connection";
import { useGesture } from "react-use-gesture";

type ConnectionProps = {
  edge: edge;
  connectedNodes: [string, string];
};

const createNodeInformation = (state: NodesState, nodeId: string) => {
  const node = state.nodes[nodeId];

  return {
    coordinates: node.coordinates,
    height: node?.height ?? 20,
    width: node?.width ?? 150,
  };
};

export const ExistingConnection: React.FC<ConnectionProps> = ({
  connectedNodes,
}) => {
  const [outputNodeId, inputNodeId] = connectedNodes;

  const outputNode: nodePositionalData = useNodesStore(
    (state) => createNodeInformation(state, outputNodeId),
    shallow
  );

  const inputNode = useNodesStore(
    (state) => createNodeInformation(state, inputNodeId),
    shallow
  );

  const [connectionCoordinates, setConnectionCoordinates] = React.useState(
    getConnectionCoordinates(outputNode, inputNode)
  );

  React.useEffect(() => {
    const newCoordinates = getConnectionCoordinates(outputNode, inputNode);

    setConnectionCoordinates(newCoordinates);
  }, [outputNode, inputNode]);

  const [hovered, setHovered] = React.useState(false);
  const removeEdge = useEdgesStore((state) => state.removeEdge);

  const curve = connectionCoordinates && calculateCurve(connectionCoordinates);

  const gestures = useGesture({
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onPointerDown: ({ event }) => event.stopPropagation(),
    onClick: () => removeEdge(outputNodeId, inputNodeId),
  });

  return (
    <Connection
      {...gestures()}
      enableEvents={true}
      curve={curve ?? ""}
      hovered={hovered}
    />
  );
};
