import React from "react";
import styles from "./IoPorts.module.css";
import { Portal } from "react-portal";
import {
  NodeDispatchContext,
  StageContext,
  ContextContext,
  EditorIdContext,
} from "../../context";
import { Control } from "../Control/Control";
import Connection from "../Connection/Connection";
import usePrevious from "../../hooks/usePrevious";
import { calculateCurve, getPortRect } from "../../connectionCalculator";
import { STAGE_ID, DRAG_CONNECTION_ID } from "../../constants";
import { port, PortTypes } from "@globalTypes/types";

function useTransputs(
  transputsFn,
  transputType,
  nodeId,
  inputData,
  connections
) {
  const nodesDispatch = React.useContext(NodeDispatchContext);
  const executionContext = React.useContext(ContextContext);

  const transputs = React.useMemo(() => {
    if (Array.isArray(transputsFn)) return transputsFn;
    return transputsFn(inputData, connections, executionContext);
  }, [transputsFn, inputData, connections, executionContext]);

  const prevTransputs = usePrevious(transputs);

  React.useEffect(() => {
    if (!prevTransputs || Array.isArray(transputsFn)) return;

    for (const transput of prevTransputs) {
      const current = transputs.find(({ name }) => transput.name === name);
      if (!current) {
        nodesDispatch({
          type: "DESTROY_TRANSPUT",
          transputType,
          transput: { nodeId, portName: "" + transput.name },
        });
      }
    }
  }, [
    transputsFn,
    transputs,
    prevTransputs,
    nodesDispatch,
    nodeId,
    transputType,
  ]);

  return transputs;
}

type IoPortsProps = {
  nodeId: string;
  inputs: port;
  outputs: port;
  connections;
  inputData;
  updateNodeConnections;
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
              data={inputData[input.name] || {}}
              isConnected={!!connections.inputs[input.name]}
              triggerRecalculation={recalculate}
              updateNodeConnections={updateNodeConnections}
              inputTypes={inputTypes}
              nodeId={nodeId}
              inputData={inputData}
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
              triggerRecalculation={recalculate}
              inputTypes={inputTypes}
              nodeId={nodeId}
              inputData={inputData}
              portOnRight
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
  type;
  label;
  name;
  nodeId;
  data;
  controls;
  inputTypes: PortTypes;
  noControls;
  recalculate: () => void;
  recalculateStageRect: () => void;
  updateNodeConnections;
  isConnected;
  inputData;
  hidePort;
};

const Input: React.FC<InputProps> = ({
  type,
  label,
  name,
  nodeId,
  data,
  controls: localControls,
  inputTypes,
  noControls,
  recalculate,
  recalculateStageRect,
  updateNodeConnections,
  isConnected,
  inputData,
  hidePort,
}) => {
  const { label: defaultLabel, color, controls: defaultControls = [] } =
    inputTypes[type] || {};
  const prevConnected = usePrevious(isConnected);

  const controls = localControls || defaultControls;

  React.useEffect(() => {
    if (isConnected !== prevConnected) {
      recalculate();
    }
  }, [isConnected, prevConnected, recalculate]);

  return (
    <div
      className={styles.transput}
      data-controlless={isConnected || noControls || !controls.length}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {!hidePort ? (
        <Port
          type={type}
          color={color}
          name={name}
          nodeId={nodeId}
          isInput
          recalculate={recalculate}
          inputTypes={inputTypes}
        />
      ) : null}
      {(!controls.length || noControls || isConnected) && (
        <label className={styles.portLabel}>{label || defaultLabel}</label>
      )}
      {!noControls && !isConnected ? (
        <div className={styles.controls}>
          {controls.map((control) => (
            <Control
              {...control}
              nodeId={nodeId}
              portName={name}
              recalculate={recalculate}
              updateNodeConnections={updateNodeConnections}
              inputLabel={label}
              data={data[control.name]}
              allData={data}
              key={control.name}
              inputData={inputData}
              isMonoControl={controls.length === 1}
              recalculateStageRect={recalculateStageRect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

type OutputProps = {
  inputTypes: PortTypes;
  label;
  name;
  nodeId;
  type;
  recalculate: () => void;
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
  type;
  isInput?;
  nodeId;
  recalculate;
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
  const nodesDispatch = React.useContext(NodeDispatchContext);
  const stageState = React.useContext(StageContext);
  const editorId = React.useContext(EditorIdContext);
  const stageId = `${STAGE_ID}${editorId}`;
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartCoordinates, setDragStartCoordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const dragStartCoordinatesCache = React.useRef(dragStartCoordinates);
  const port = React.useRef<HTMLDivElement>();
  const line = React.useRef<SVGElement>();
  const lineInToPort = React.useRef<SVGElement>();

  const byScale = (value) => (1 / stageState.scale) * value;

  const handleDrag = (e) => {
    const stage = document.getElementById(stageId).getBoundingClientRect();

    if (isInput) {
      const to = {
        x:
          byScale(e.clientX - stage.x - stage.width / 2) +
          byScale(stageState.translate.x),
        y:
          byScale(e.clientY - stage.y - stage.height / 2) +
          byScale(stageState.translate.y),
      };
      lineInToPort.current.setAttribute(
        "d",
        calculateCurve(dragStartCoordinatesCache.current, to)
      );
    } else {
      const to = {
        x:
          byScale(e.clientX - stage.x - stage.width / 2) +
          byScale(stageState.translate.x),
        y:
          byScale(e.clientY - stage.y - stage.height / 2) +
          byScale(stageState.translate.y),
      };
      line.current.setAttribute(
        "d",
        calculateCurve(dragStartCoordinatesCache.current, to)
      );
    }
  };

  const handleDragEnd = (e) => {
    const droppedOnPort = !!e.target.dataset.portName;

    if (isInput) {
      const {
        inputNodeId,
        inputPortName,
        outputNodeId,
        outputPortName,
      } = lineInToPort.current.dataset;
      nodesDispatch({
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
            nodesDispatch({
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
            nodesDispatch({
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

  const handleDragStart = (e) => {
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
            ) + byScale(stageState.translate.x),
          y:
            byScale(
              outputPort.y - stage.y + outputPort.width / 2 - stage.height / 2
            ) + byScale(stageState.translate.y),
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
          ) + byScale(stageState.translate.x),
        y:
          byScale(
            startPort.y - stage.y + startPort.width / 2 - stage.height / 2
          ) + byScale(stageState.translate.y),
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
        <Portal
          node={document.getElementById(`${DRAG_CONNECTION_ID}${editorId}`)}
        >
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