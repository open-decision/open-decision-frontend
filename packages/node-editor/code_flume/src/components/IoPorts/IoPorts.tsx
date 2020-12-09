import React from "react";
import styles from "./IoPorts.module.css";
import { Portal } from "react-portal";
import { Connection } from "../Connection/Connection";
import usePrevious from "../../hooks/usePrevious";
import {
  calculateCurve,
  getPortRect,
  STAGE_ID,
  DRAG_CONNECTION_ID,
  EditorContext,
  EditorDispatchContext,
} from "@utilities/index";
import { connections, port, PortTypes } from "@globalTypes/types";

function useTransputs(
  transputsFn: port,
  transputType: "input" | "output",
  nodeId: string,
  inputData: any,
  connections: connections
) {
  const dispatch = React.useContext(EditorDispatchContext);

  const transputs = React.useMemo(() => {
    if (Array.isArray(transputsFn)) return transputsFn;
    return transputsFn(inputData, connections);
  }, [transputsFn, inputData, connections]);

  const prevTransputs = usePrevious(transputs);

  React.useEffect(() => {
    if (!prevTransputs || Array.isArray(transputsFn)) return;

    for (const transput of prevTransputs) {
      const current = transputs.find(({ name }) => transput.name === name);
      if (!current) {
        dispatch({
          type: "DESTROY_TRANSPUT",
          transputType,
          transput: { nodeId, portName: "" + transput.name },
        });
      }
    }
  }, [transputsFn, transputs, prevTransputs, dispatch, nodeId, transputType]);

  return transputs;
}

type IoPortsProps = {
  nodeId: string;
  inputs: port;
  outputs: port;
  connections: connections;
  inputData: any;
  updateNodeConnections: () => void;
  inputTypes: PortTypes;
  recalculate: () => void;
  recalculateStageRect?: () => void;
};

const IoPorts: React.FC<IoPortsProps> = ({
  nodeId,
  inputs = [],
  outputs = [],
  connections,
  inputData,
  updateNodeConnections,
  inputTypes,
  recalculate,
}) => {
  const resolvedInputs = useTransputs(
    inputs,
    "input",
    nodeId,
    inputData,
    connections
  );
  const resolvedOutputs = useTransputs(
    outputs,
    "output",
    nodeId,
    inputData,
    connections
  );

  return (
    <div className={styles.wrapper}>
      {resolvedInputs.length ? (
        <div className={styles.inputs}>
          {resolvedInputs.map((input) => (
            <Input
              {...input}
              isConnected={!!connections.inputs[input.name]}
              recalculate={recalculate}
              inputTypes={inputTypes}
              nodeId={nodeId}
              key={input.name}
            />
          ))}
        </div>
      ) : null}
      {!!resolvedOutputs.length && (
        <div className={styles.outputs}>
          {resolvedOutputs.map((output) => (
            <Output
              {...output}
              recalculate={recalculate}
              inputTypes={inputTypes}
              nodeId={nodeId}
              key={output.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IoPorts;

type InputProps = {
  type?: string;
  label?: string;
  name?: string;
  nodeId?: string;
  inputTypes?: PortTypes;
  recalculate?: () => void;
  recalculateStageRect?: () => void;
  isConnected?: boolean;
};

const Input: React.FC<InputProps> = ({
  type,
  label,
  name,
  nodeId,
  inputTypes,
  recalculate,
  isConnected,
}) => {
  const { label: defaultLabel, color } = inputTypes[type] || {};
  const prevConnected = usePrevious(isConnected);

  React.useEffect(() => {
    if (isConnected !== prevConnected) {
      recalculate();
    }
  }, [isConnected, prevConnected, recalculate]);

  return (
    <div
      className={styles.transput}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Port
        type={type}
        color={color}
        name={name}
        nodeId={nodeId}
        isInput
        recalculate={recalculate}
        inputTypes={inputTypes}
      />
      <label className={styles.portLabel}>{label || defaultLabel}</label>
    </div>
  );
};

type OutputProps = {
  inputTypes?: PortTypes;
  label?: string;
  name?: string;
  nodeId?: string;
  type?: string;
  recalculate?: () => void;
};

const Output: React.FC<OutputProps> = ({
  label,
  name,
  nodeId,
  type,
  inputTypes,
  recalculate,
}) => {
  const { label: defaultLabel, color } = inputTypes[type] || {};

  return (
    <div
      className={styles.transput}
      data-controlless={true}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <label className={styles.portLabel}>{label || defaultLabel}</label>
      <Port
        type={type}
        name={name}
        color={color}
        nodeId={nodeId}
        recalculate={recalculate}
        inputTypes={inputTypes}
      />
    </div>
  );
};

type PortProps = {
  color: string;
  name: string;
  type: string;
  isInput?: boolean;
  nodeId: string;
  recalculate: () => void;
  inputTypes: PortTypes;
};

const Port: React.FC<PortProps> = ({
  color = "grey",
  name = "",
  type,
  isInput,
  nodeId,
  recalculate,
  inputTypes,
}) => {
  const dispatch = React.useContext(EditorDispatchContext);
  const { id, zoom, position } = React.useContext(EditorContext);
  const stageId = `${STAGE_ID}${id}`;
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartCoordinates, setDragStartCoordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const dragStartCoordinatesCache = React.useRef(dragStartCoordinates);
  const port = React.useRef<HTMLDivElement>();
  const line = React.useRef<SVGPathElement>();
  const lineInToPort = React.useRef<SVGElement>();

  const byScale = (value: number) => (1 / zoom) * value;

  const handleDrag = (e: MouseEvent) => {
    const stage = document.getElementById(stageId).getBoundingClientRect();

    if (isInput) {
      const to = {
        x: byScale(e.clientX - stage.x - stage.width / 2) + byScale(position.x),
        y:
          byScale(e.clientY - stage.y - stage.height / 2) + byScale(position.y),
      };
      lineInToPort.current.setAttribute(
        "d",
        calculateCurve(dragStartCoordinatesCache.current, to)
      );
    } else {
      const to = {
        x: byScale(e.clientX - stage.x - stage.width / 2) + byScale(position.x),
        y:
          byScale(e.clientY - stage.y - stage.height / 2) + byScale(position.y),
      };
      line.current.setAttribute(
        "d",
        calculateCurve(dragStartCoordinatesCache.current, to)
      );
    }
  };

  const handleDragEnd = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const droppedOnPort = !!e.target.dataset.portName;

    if (isInput) {
      const {
        inputNodeId,
        inputPortName,
        outputNodeId,
        outputPortName,
      } = lineInToPort.current.dataset;
      dispatch({
        type: "REMOVE_CONNECTION",
        input: { nodeId: inputNodeId, portName: inputPortName },
        output: { nodeId: outputNodeId, portName: outputPortName },
      });
      if (droppedOnPort) {
        const {
          portName: connectToPortName,
          nodeId: connectToNodeId,
          portType: connectToPortType,
          portTransputType: connectToTransputType,
        } = e.target.dataset;
        const isNotSameNode = outputNodeId !== connectToNodeId;
        if (isNotSameNode && connectToTransputType !== "output") {
          const inputWillAcceptConnection = inputTypes[
            connectToPortType
          ].acceptTypes.includes(type);
          if (inputWillAcceptConnection) {
            dispatch({
              type: "ADD_CONNECTION",
              input: { nodeId: connectToNodeId, portName: connectToPortName },
              output: { nodeId: outputNodeId, portName: outputPortName },
            });
          }
        }
      }
    } else {
      if (droppedOnPort) {
        const {
          portName: inputPortName,
          nodeId: inputNodeId,
          portType: inputNodeType,
          portTransputType: inputTransputType,
        } = e.target.dataset;
        const isNotSameNode = inputNodeId !== nodeId;
        if (isNotSameNode && inputTransputType !== "output") {
          const inputWillAcceptConnection = inputTypes[
            inputNodeType
          ].acceptTypes.includes(type);
          if (inputWillAcceptConnection) {
            dispatch({
              type: "ADD_CONNECTION",
              output: { nodeId, portName: name },
              input: { nodeId: inputNodeId, portName: inputPortName },
            });
            recalculate();
          }
        }
      }
    }
    setIsDragging(false);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("mousemove", handleDrag);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const startPort = port.current.getBoundingClientRect();
    const stage = document.getElementById(stageId).getBoundingClientRect();

    if (isInput) {
      lineInToPort.current = document.querySelector(
        `[data-input-node-id="${nodeId}"][data-input-port-name="${name}"]`
      );
      const portIsConnected = !!lineInToPort.current;
      if (portIsConnected) {
        lineInToPort.current.parentElement.style.zIndex = "9999";
        const outputPort = getPortRect(
          lineInToPort.current.dataset.outputNodeId,
          lineInToPort.current.dataset.outputPortName,
          "output"
        );
        const coordinates = {
          x:
            byScale(
              outputPort.x - stage.x + outputPort.width / 2 - stage.width / 2
            ) + byScale(position.x),
          y:
            byScale(
              outputPort.y - stage.y + outputPort.width / 2 - stage.height / 2
            ) + byScale(position.y),
        };
        setDragStartCoordinates(coordinates);
        dragStartCoordinatesCache.current = coordinates;
        setIsDragging(true);
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("mousemove", handleDrag);
      }
    } else {
      const coordinates = {
        x:
          byScale(
            startPort.x - stage.x + startPort.width / 2 - stage.width / 2
          ) + byScale(position.x),
        y:
          byScale(
            startPort.y - stage.y + startPort.width / 2 - stage.height / 2
          ) + byScale(position.y),
      };
      setDragStartCoordinates(coordinates);
      dragStartCoordinatesCache.current = coordinates;
      setIsDragging(true);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("mousemove", handleDrag);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{ zIndex: 999 }}
        onMouseDown={handleDragStart}
        className={styles.port}
        data-port-color={color}
        data-port-name={name}
        data-port-type={type}
        data-port-transput-type={isInput ? "input" : "output"}
        data-node-id={nodeId}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        ref={port}
      />
      {isDragging && !isInput ? (
        <Portal node={document.getElementById(`${DRAG_CONNECTION_ID}${id}`)}>
          <Connection
            from={dragStartCoordinates}
            to={dragStartCoordinates}
            lineRef={line}
          />
        </Portal>
      ) : null}
    </React.Fragment>
  );
};
