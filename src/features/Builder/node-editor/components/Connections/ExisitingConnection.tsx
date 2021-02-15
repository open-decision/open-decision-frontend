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
  id?: string;
  outputNodeId?: string;
  outputPortName?: string;
  inputNodeId?: string;
  inputPortName?: string;
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
  id,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}) => {
  const [originNodeId, destinationNodeId] = connectedNodes;

  const originNode: nodePositionalData = useNodesStore(
    (state) => createNodeInformation(state, originNodeId),
    shallow
  );

  const destinationNode = useNodesStore(
    (state) => createNodeInformation(state, destinationNodeId),
    shallow
  );

  const [connectionCoordinates, setConnectionCoordinates] = React.useState(
    getConnectionCoordinates(originNode, destinationNode)
  );

  React.useEffect(() => {
    const newCoordinates = getConnectionCoordinates(
      originNode,
      destinationNode
    );

    setConnectionCoordinates(newCoordinates);
  }, [destinationNode, originNode]);

  const [hovered, setHovered] = React.useState(false);
  const removeEdge = useEdgesStore((state) => state.removeEdge);

  const curve = connectionCoordinates && calculateCurve(connectionCoordinates);

  const gestures = useGesture({
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onPointerDown: ({ event }) => event.stopPropagation(),
    onClick: () => removeEdge(originNodeId, destinationNodeId),
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
