import React from "react";
import styles from "./Node.module.css";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import { coordinates } from "../../types";
import { useGesture } from "react-use-gesture";
import { useEditorStore, useNodesStore } from "../../globalState/stores";
import shallow from "zustand/shallow";

const deleteNodeMenuoption: menuOption = {
  label: "Delete Node",
  type: "deleteNode",
  description: "Deletes a node and all of its connections.",
  internalType: "node",
};

type NodeProps = {
  id: string;
};

export const Node: React.FC<NodeProps> = ({ id, ...props }) => {
  const [nodeTypes] = useEditorStore(
    (state) => [state.editorConfig.config[0]],
    shallow
  );

  const setNode = useNodesStore((state) => state.setNode);
  const node = useNodesStore((state) => state.nodes[id]);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable } = nodeTypes[node.type];
  const nodeOptions = deletable ? [deleteNodeMenuoption] : [];

  // Track local menu state.
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState<coordinates>([
    0,
    0,
  ]);

  const nodeGestures = useGesture(
    {
      onDrag: ({ movement, event }) => {
        event.stopPropagation();
        setNode({ ...node, coordinates: movement, dragging: true });
      },
      onDragEnd: () => {
        setNode({ ...node, dragging: false });
      },
    },
    { drag: { initial: node.coordinates } }
  );

  //TODO Refactor Nodes Menu
  // const handleContextMenu = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setMenuCoordinates([e.clientX, e.clientY]);
  //   setMenuOpen(true);
  //   return false;
  // };

  // const handleMenuOption = ({ type: value }: menuOption) => {
  //   switch (value) {
  //     case "deleteNode":
  //       dispatch({
  //         type: "REMOVE_NODE",
  //         nodeId: node.id,
  //       });
  //       break;
  //     default:
  //       return;
  //   }
  // };

  return (
    <div
      className={styles.wrapper}
      style={{
        width: node.width,
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
      }}
      id={node.id}
      // onContextMenu={handleContextMenu}
      {...nodeGestures()}
      {...props}
    >
      <h2 className={styles.label}>{node.id}</h2>
      {/* {menuOpen ? (
        <Portal>
          <ContextMenu
            coordinates={menuCoordinates}
            options={nodeOptions}
            onRequestClose={() => setMenuOpen(false)}
            // onOptionSelected={handleMenuOption}
            hideFilter
            label="Node Options"
            emptyText="This node has no options."
          />
        </Portal>
      ) : null} */}
    </div>
  );
};
