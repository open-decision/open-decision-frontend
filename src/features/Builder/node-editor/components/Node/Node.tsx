import React from "react";
import styles from "./Node.module.css";
import { getPortRect, calculateCurve, EditorContext } from "../../utilities";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import { IoPorts } from "../IoPorts/IoPorts";
import { Connections, coordinates, Node as NodeType } from "../../types";
import { useGesture } from "react-use-gesture";

const deleteNodeMenuoption: menuOption = {
  label: "Delete Node",
  type: "deleteNode",
  description: "Deletes a node and all of its connections.",
  internalType: "node",
};

type NodeProps = {
  node: NodeType;
  stageRect: React.MutableRefObject<DOMRect | null>;
  recalculate: () => void;
};

export const Node: React.FC<NodeProps> = ({
  node,
  stageRect,
  recalculate,
  ...props
}) => {
  const [
    {
      coordinates: stageCoordinates,
      zoom,
      config: [nodeTypes],
    },
    dispatch,
  ] = React.useContext(EditorContext);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable, inputPorts = [], outputPorts = [] } = nodeTypes[
    node.type
  ];

  const nodeOptions = deletable ? [deleteNodeMenuoption] : [];

  // Track local menu state.
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState<coordinates>([
    0,
    0,
  ]);

  const [coordinates, setCoordinates] = React.useState(node.coordinates);

  const nodeGestures = useGesture(
    {
      onDrag: ({ movement, event }) => {
        //To avoid panning the Stage when dragging the Node we stop the propagation of the event.
        event.stopPropagation();
        setCoordinates(movement);
        updateNodeConnections();
      },
      onDragEnd: () =>
        dispatch({
          type: "SET_NODE_COORDINATES",
          coordinates,
          nodeId: node.id,
        }),
    },
    { drag: { initial: coordinates } }
  );

  const byScale = (value: number) => (1 / zoom) * value;

  const updateConnections = (connections: Connections, isOutput?: boolean) =>
    Object.entries(connections).forEach(([portName, connections]) => {
      connections.forEach((connection) => {
        const toRect = getPortRect(
          node.id,
          portName,
          isOutput ? "output" : "input"
        );

        const fromRect = getPortRect(
          connection.nodeId,
          connection.portName,
          isOutput ? "input" : "output"
        );

        if (fromRect && toRect && stageRect.current) {
          const portHalf = fromRect.width / 2;

          let combined: string;

          if (isOutput) {
            combined =
              node.id + portName + connection.nodeId + connection.portName;
          } else {
            combined =
              connection.nodeId + connection.portName + node.id + portName;
          }

          const cnx = document.querySelector(
            `[data-connection-id="${combined}"]`
          );

          const from: coordinates = [
            byScale(
              toRect.x -
                stageRect.current.x +
                portHalf -
                stageRect.current.width / 2
            ) + byScale(stageCoordinates[0]),
            byScale(
              toRect.y -
                stageRect.current.y +
                portHalf -
                stageRect.current.height / 2
            ) + byScale(stageCoordinates[1]),
          ];

          const to: coordinates = [
            byScale(
              fromRect.x -
                stageRect.current.x +
                portHalf -
                stageRect.current.width / 2
            ) + byScale(stageCoordinates[0]),
            byScale(
              fromRect.y -
                stageRect.current.y +
                portHalf -
                stageRect.current.height / 2
            ) + byScale(stageCoordinates[1]),
          ];

          cnx?.setAttribute("d", calculateCurve(from, to));
        }
      });
    });

  const updateNodeConnections = () => {
    if (node.connections) {
      updateConnections(node.connections.inputs);
      updateConnections(node.connections.outputs, true);
    }
  };

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

  return (
    <div
      className={styles.wrapper}
      style={{
        width: node.width,
        transform: `translate(${coordinates[0]}px, ${coordinates[1]}px)`,
      }}
      {...nodeGestures()}
      data-node-id={node.id}
      onContextMenu={handleContextMenu}
      {...props}
    >
      <h2 className={styles.label}>{label}</h2>
      <IoPorts
        nodeId={node.id}
        inputs={inputPorts}
        outputs={outputPorts}
        connections={node.connections}
        recalculate={recalculate}
      />
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
};
