import React from "react";
import { useEdgesStore } from "../../globalState/stores";
import { Connection } from "./Connection";

type NodeConnectionsProps = { originNodeId: string };

export const NodeConnections: React.FC<NodeConnectionsProps> = React.memo(
  ({ originNodeId, ...props }) => {
    const connections = useEdgesStore((state) => state.edges[originNodeId]);

    return (
      <div {...props}>
        {connections.map((edge) => {
          return (
            <Connection
              edge={edge}
              id={`${originNodeId}-${edge.nodeId}`}
              key={`${originNodeId}-${edge.nodeId}`}
              connectedNodes={[originNodeId, edge.nodeId]}
            />
          );
        })}
      </div>
    );
  }
);

NodeConnections.displayName = "NodeConnections";
