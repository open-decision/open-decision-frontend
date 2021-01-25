import React from "react";
import styles from "./Connection.module.css";
import { calculateCurve } from "../../utilities/connections/shared";
import {
  NodesState,
  useEdgesStore,
  useEditorStore,
  useNodesStore,
} from "../../globalState/stores";
import { edge, nodeInformation } from "../../types";
import shallow from "zustand/shallow";
import { getConnectionCoordinates } from "../../globalState/getConnectionCoordinates";

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
    id: node.id,
    coordinates: node.coordinates,
    height: node?.height ?? 20,
    width: node?.width ?? 150,
    dragging: node?.dragging ?? false,
  };
};

export const Connection: React.FC<ConnectionProps> = ({
  connectedNodes,
  id,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}) => {
  // const setEdgeData = useEdgesStore((state) => state.setEdgeData);
  const [originNodeId, destinationNodeId] = connectedNodes;

  const originNode: nodeInformation = useNodesStore(
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
    <svg className={styles.svg}>
      {curve && (
        <path
          data-connection-id={id}
          data-output-node-id={outputNodeId}
          data-output-port-name={outputPortName}
          data-input-node-id={inputNodeId}
          data-input-port-name={inputPortName}
          stroke="rgb(185, 186, 189)"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          d={curve}
        />
      )}
    </svg>
  );
};

Connection.displayName = "Connection";
