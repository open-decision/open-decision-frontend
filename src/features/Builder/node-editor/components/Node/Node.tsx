import React from "react";
import styles from "./Node.module.css";
import { useGesture } from "react-use-gesture";
import { useNodesStore } from "../../globalState/stores";
import shallow from "zustand/shallow";

type NodeProps = {
  id: string;
};

export const Node: React.FC<NodeProps> = ({ id, ...props }) => {
  const nodeTypes = useNodesStore((state) => state.nodeTypes, shallow);

  const setNode = useNodesStore((state) => state.setNode);
  const node = useNodesStore((state) => state.nodes[id]);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable } = nodeTypes[node.type];

  const nodeGestures = useGesture(
    {
      onDrag: ({ movement, event }) => {
        event.stopPropagation();
        setNode(id, { ...node, coordinates: movement, dragging: true });
      },
      onDragEnd: () => {
        setNode(id, { ...node, dragging: false });
      },
    },
    { drag: { initial: node.coordinates } }
  );

  return (
    <div
      className={styles.wrapper}
      style={{
        width: node.width,
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
      }}
      id={id}
      {...nodeGestures()}
      {...props}
    >
      <h2 className={styles.label}>{id}</h2>
    </div>
  );
};
