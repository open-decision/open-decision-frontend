import React from "react";
import { calculateCurve, getConnectionCoordinates } from "../../utilities";
import { NodesState, useNodesStore } from "../../globalState";
import { edge, nodePositionalData } from "../../types";
import shallow from "zustand/shallow";
import { Connection } from "./Connection";

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
  // const setEdgeData = useEdgesStore((state) => state.setEdgeData);
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

  const curve = connectionCoordinates && calculateCurve(connectionCoordinates);

  return (
    <Connection
      curve={curve ?? ""}
      data-connection-id={id}
      data-output-node-id={outputNodeId}
      data-output-port-name={outputPortName}
      data-input-node-id={inputNodeId}
      data-input-port-name={inputPortName}
    />
  );
};
