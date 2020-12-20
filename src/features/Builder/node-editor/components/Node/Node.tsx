import React from "react";
import styles from "./Node.module.css";
import { getPortRect, calculateCurve, EditorContext } from "../../utilities";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import { IoPorts } from "../IoPorts/IoPorts";
import { Draggable } from "../Draggable/Draggable";
import { Connections, coordinates, Node as NodeType } from "../../types";

type NodeProps = {
  node: NodeType;
  stageRect: React.MutableRefObject<DOMRect | null>;
  onDragStart: (e: MouseEvent) => void;
  recalculate: () => void;
};

export const Node: React.FC<NodeProps> = ({
  node,
  stageRect,
  onDragStart,
  recalculate,
  ...props
}) => {
  const [
    {
      position,
      zoom,
      config: [nodeTypes],
    },
    dispatch,
  ] = React.useContext(EditorContext);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable, inputPorts = [], outputPorts = [] } = nodeTypes[
    node.type
  ];

  const wrapper = React.useRef<HTMLDivElement>(null);

  // Track local menu state.
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });

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

        if (fromRect && toRect) {
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

          const from = {
            x:
              byScale(
                toRect.x -
                  stageRect.current.x +
                  portHalf -
                  stageRect.current.width / 2
              ) + byScale(position.x),
            y:
              byScale(
                toRect.y -
                  stageRect.current.y +
                  portHalf -
                  stageRect.current.height / 2
              ) + byScale(position.y),
          };

          const to = {
            x:
              byScale(
                fromRect.x -
                  stageRect.current.x +
                  portHalf -
                  stageRect.current.width / 2
              ) + byScale(position.x),
            y:
              byScale(
                fromRect.y -
                  stageRect.current.y +
                  portHalf -
                  stageRect.current.height / 2
              ) + byScale(position.y),
          };

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

  const stopDrag = (coordinates: coordinates, _e: MouseEvent) => {
    dispatch({
      type: "SET_NODE_COORDINATES",
      ...coordinates,
      nodeId: node.id,
    });
  };

  const handleDrag = (coordinates: coordinates, _e: MouseEvent) => {
    wrapper.current
      ? (wrapper.current.style.transform = `translate(${coordinates.x}px,${coordinates.y}px)`)
      : null;

    updateNodeConnections();
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
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
    <Draggable
      className={styles.wrapper}
      style={{
        width: node.width,
        transform: `translate(${node.coordinates.x}px, ${node.coordinates.y}px)`,
      }}
      // onDragStart={onDragStart}
      onDrag={handleDrag}
      onDragEnd={stopDrag}
      innerRef={wrapper}
      data-node-id={node.id}
      onContextMenu={handleContextMenu}
      stageRect={stageRect}
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
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={[
              ...(deletable !== false
                ? [
                    {
                      label: "Delete Node",
                      value: "deleteNode",
                      description: "Deletes a node and all of its connections.",
                    },
                  ]
                : []),
            ]}
            onRequestClose={() => setMenuOpen(false)}
            onOptionSelected={handleMenuOption}
            hideFilter
            label="Node Options"
            emptyText="This node has no options."
          />
        </Portal>
      ) : null}
    </Draggable>
  );
};
