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
    <div className="absolute left-0 h-0">
      {connections.map(([outputNodeId, edges]) =>
        edges.map((edge) => (
          <ExistingConnection
            edge={edge}
            key={`${outputNodeId}-${edge.nodeId}`}
            connectedNodes={[outputNodeId, edge.nodeId]}
          />
        ))
      )}
    </div>
  );
};
