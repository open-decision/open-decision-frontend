import React from "react";
import shallow from "zustand/shallow";
import { useEdgesStore } from "../../globalState";
import { ExistingConnection } from "./ExisitingConnection";

export const ConnectionsWrapper: React.FC = () => {
  const connections = useEdgesStore(
    (state) => Object.entries(state.edges),
    shallow
  );

  return (
    <div>
      {connections.map(([originNodeId, edges]) =>
        edges.map((edge) => (
          <ExistingConnection
            edge={edge}
            key={`${originNodeId}-${edge.nodeId}`}
            connectedNodes={[originNodeId, edge.nodeId]}
          />
        ))
      )}
    </div>
  );
};
