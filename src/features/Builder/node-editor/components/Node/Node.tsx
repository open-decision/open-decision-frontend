import React from "react";
import styles from "./Node.module.css";
import { EditorContext } from "../../utilities";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import { IoPorts } from "../IoPorts/IoPorts";
import {
  Connection,
  Connections,
  coordinates,
  Node as NodeType,
} from "../../types";
import { useGesture } from "react-use-gesture";
import {
  calculateCurve,
  getPortRect,
} from "../../utilities/connections/shared";

const deleteNodeMenuoption: menuOption = {
  label: "Delete Node",
  type: "deleteNode",
  description: "Deletes a node and all of its connections.",
  internalType: "node",
};

type NodeProps = {
  node: NodeType;
};

export const Node: React.FC<NodeProps> = React.memo(({ node, ...props }) => {
  const [
    {
      coordinates,
      config: [nodeTypes],
    },
    dispatch,
  ] = React.useContext(EditorContext);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable } = nodeTypes[node.type];
  const ref = React.useRef<HTMLDivElement | null>(null);
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
        //To avoid panning the Stage when dragging the Node we stop the propagation of the event.
        event.stopPropagation();
        // setCoordinates(movement);
        // updateNodeConnections();
        const nodeRuntimeData = ref.current?.getBoundingClientRect();

        nodeRuntimeData &&
          dispatch({
            type: "SET_NODE_COORDINATES",
            coordinates: movement,
            nodeId: node.id,
            nodeRuntimeData,
          });
      },
    },
    { drag: { initial: node.coordinates } }
  );

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates([e.clientX, e.clientY]);
    setMenuOpen(true);
    return false;
  };

  const handleMenuOption = ({ type: value }: menuOption) => {
    switch (value) {
      case "deleteNode":
        dispatch({
          type: "REMOVE_NODE",
          nodeId: node.id,
        });
        break;
      default:
        return;
    }
  };

  React.useLayoutEffect(() => {
    const nodeRuntimeData = ref.current?.getBoundingClientRect();

    nodeRuntimeData &&
      dispatch({
        type: "ADD_NODE_RUNTIME_DATA",
        id: node.id,
        nodeRuntimeData,
      });
  }, [dispatch, node.id, coordinates]);

  console.log("rendered Node", node.id);

  return (
    <div
      className={styles.wrapper}
      style={{
        width: node.width,
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
      }}
      id={node.id}
      onContextMenu={handleContextMenu}
      ref={ref}
      {...nodeGestures()}
      {...props}
    >
      <h2 className={styles.label}>{label}</h2>
      {/* <IoPorts
        nodeId={node.id}
        inputs={inputPorts}
        outputs={outputPorts}
        connections={node.connections}
        recalculate={recalculate}
      /> */}
      {menuOpen ? (
        <Portal>
          <ContextMenu
            coordinates={menuCoordinates}
            options={nodeOptions}
            onRequestClose={() => setMenuOpen(false)}
            onOptionSelected={handleMenuOption}
            hideFilter
            label="Node Options"
            emptyText="This node has no options."
          />
        </Portal>
      ) : null}
    </div>
  );
});
