import React from "react";
import shallow from "zustand/shallow";
import { useEdgesStore } from "../../globalState/stores";
import { CONNECTIONS_ID } from "../../utilities";
import styles from "./Connections.module.css";
import { NodeConnections } from "./NodeConnections";

export const ConnectionsWrapper: React.FC = () => {
  const edges = useEdgesStore((state) => Object.keys(state.edges), shallow);

  return (
    <div className={styles.svgWrapper} id={`${CONNECTIONS_ID}`}>
      {edges.map((originNodeId) => (
        <NodeConnections originNodeId={originNodeId} key={originNodeId} />
      ))}
    </div>
  );
};