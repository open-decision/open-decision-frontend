import React from "react";
import styles from "./Node.module.css";
import {
  getPortRect,
  calculateCurve,
  EditorContext,
  EditorDispatchContext,
} from "@utilities/index";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import IoPorts from "../IoPorts/IoPorts";
import { Draggable } from "../Draggable/Draggable";
import {
  connection,
  connections,
  coordinates,
  NodeTypes,
  PortTypes,
} from "@globalTypes/types";

type NodeProps = {
  id?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  delay?: number;
  stageRect?: DOMRect;
  connections?: connections;
  type?: string;
  inputData?: any;
  onDragStart?: (e: MouseEvent) => void;
  onDragEnd?: (coordinates: coordinates, e: MouseEvent) => void;
  onDrag?: (coordinates: coordinates, e: MouseEvent) => void;
  nodeTypes: NodeTypes;
  portTypes: PortTypes;
  recalculate: () => void;
};

export const Node: React.FC<NodeProps> = ({
  id,
  width,
  height,
  x,
  y,
  delay = 6,
  stageRect,
  connections,
  type,
  inputData,
  onDragStart,
  onDragEnd,
  onDrag,
  nodeTypes,
  portTypes,
  recalculate,
  ...props
}) => {
  const dispatch = React.useContext(EditorDispatchContext);
  const { position, zoom } = React.useContext(EditorContext);
  const { label, deletable, inputs = [], outputs = [] } = nodeTypes[type];

  const nodeWrapper = React.useRef<HTMLDivElement>();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });

  const byScale = (value: number) => (1 / zoom) * value;

  const updateConnectionsByTransput = (
    transput: connection,
    isOutput?: boolean
  ) => {
    Object.entries(transput).forEach(([portName, outputs]) => {
      outputs.forEach((output) => {
        const toRect = getPortRect(id, portName, isOutput ? "output" : "input");

        const fromRect = getPortRect(
          output.nodeId,
          output.portName,
          isOutput ? "input" : "output"
        );

        const portHalf = fromRect.width / 2;

        let combined;

        if (isOutput) {
          combined = id + portName + output.nodeId + output.portName;
        } else {
          combined = output.nodeId + output.portName + id + portName;
        }

        let cnx;

        cnx = document.querySelector(`[data-connection-id="${combined}"]`);

        const from = {
          x:
            byScale(toRect.x - stageRect.x + portHalf - stageRect.width / 2) +
            byScale(position.x),
          y:
            byScale(toRect.y - stageRect.y + portHalf - stageRect.height / 2) +
            byScale(position.y),
        };

        const to = {
          x:
            byScale(fromRect.x - stageRect.x + portHalf - stageRect.width / 2) +
            byScale(position.x),
          y:
            byScale(
              fromRect.y - stageRect.y + portHalf - stageRect.height / 2
            ) + byScale(position.y),
        };

        cnx.setAttribute("d", calculateCurve(from, to));
      });
    });
  };

  const updateNodeConnections = () => {
    if (connections) {
      updateConnectionsByTransput(connections.inputs);
      updateConnectionsByTransput(connections.outputs, true);
    }
  };

  const stopDrag = (coordinates: coordinates, _e: MouseEvent) => {
    dispatch({
      type: "SET_NODE_COORDINATES",
      ...coordinates,
      nodeId: id,
    });
  };

  const handleDrag = (coordinates: coordinates, _e: MouseEvent) => {
    nodeWrapper.current.style.transform = `translate(${coordinates.x}px,${coordinates.y}px)`;
    updateNodeConnections();
  };

  const startDrag = (e: MouseEvent) => {
    onDragStart(e);
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

  const closeContextMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuOption = ({ value }: menuOption) => {
    switch (value) {
      case "deleteNode":
        dispatch({
          type: "REMOVE_NODE",
          nodeId: id,
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
        width,
        transform: `translate(${x}px, ${y}px)`,
      }}
      onDragStart={startDrag}
      onDrag={handleDrag}
      onDragEnd={stopDrag}
      innerRef={nodeWrapper}
      data-node-id={id}
      onContextMenu={handleContextMenu}
      stageRect={stageRect}
      {...props}
    >
      <h2 className={styles.label}>{label}</h2>
      <IoPorts
        nodeId={id}
        inputs={inputs}
        outputs={outputs}
        connections={connections}
        updateNodeConnections={updateNodeConnections}
        inputData={inputData}
        inputTypes={portTypes}
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
            onRequestClose={closeContextMenu}
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
