// /* eslint-disable jsx-a11y/no-static-element-interactions */
// import React from "react";
// import styles from "./IoPorts.module.css";
// import { Portal } from "react-portal";
// import { Connection } from "../Connections/Connection";
// import { STAGE_ID, DRAG_CONNECTION_ID, EditorContext } from "../../utilities";
// import { Transputs, coordinates, portConfig, portTypes } from "../../types";
// import { nanoid } from "nanoid/non-secure";
// import { useGesture } from "react-use-gesture";
// import { calculateCurve } from "../../utilities/connections/shared";

// type IoPortsProps = {
//   /**
//    * The id of the node this is rendered as a child of.
//    */
//   nodeId: string;
//   /**
//    * The inputs of the Node.
//    */
//   inputs: portConfig[];
//   /**
//    * The outputs of the Node.
//    */
//   outputs: portConfig[];
//   /**
//    * The connections of the Node. This informs the individual Port whether it is connected or not.
//    */
//   connections: Transputs;
//   recalculate: () => void;
// };

// /**
//  * A component that renders all inputs and outputs of a Node.
//  */
// export const IoPorts: React.FC<IoPortsProps> = ({
//   nodeId,
//   inputs = [],
//   outputs = [],
//   connections,
//   recalculate,
// }) => {
//   return (
//     <div className={styles.wrapper}>
//       {inputs.length ? (
//         <div className={styles.inputs}>
//           {inputs.map((input) => (
//             <Input
//               {...input}
//               isConnected={!!connections.inputs[input.type]}
//               recalculate={recalculate}
//               nodeId={nodeId}
//               key={nanoid(10)}
//             />
//           ))}
//         </div>
//       ) : null}
//       {!!outputs.length && (
//         <div className={styles.outputs}>
//           {outputs.map((output) => (
//             <Output
//               {...output}
//               recalculate={recalculate}
//               nodeId={nodeId}
//               key={nanoid(10)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// type InputProps = {
//   type: string;
//   label?: string;
//   nodeId: string;
//   name: string;
//   recalculate: () => void;
//   isConnected?: boolean;
// };

// const Input: React.FC<InputProps> = ({
//   type,
//   label,
//   nodeId,
//   name,
//   recalculate,
//   isConnected,
// }) => {
//   const [
//     {
//       config: [, portTypes],
//     },
//   ] = React.useContext(EditorContext);
//   const { label: defaultLabel, color } = portTypes[type] || {};

//   React.useEffect(() => {
//     recalculate();
//   }, [isConnected, recalculate]);

//   return (
//     <div
//       className={styles.transput}
//       onDragStart={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//       }}
//     >
//       <Port
//         type={type}
//         color={color ?? "blue"}
//         nodeId={nodeId}
//         name={name}
//         isInput
//         recalculate={recalculate}
//         portTypes={portTypes}
//       />
//       <label className={styles.portLabel}>{label || defaultLabel}</label>
//     </div>
//   );
// };

// type OutputProps = {
//   label?: string;
//   nodeId: string;
//   name: string;
//   type: string;
//   recalculate: () => void;
// };

// const Output: React.FC<OutputProps> = ({
//   label,
//   name,
//   nodeId,
//   type,
//   recalculate,
// }) => {
//   const [
//     {
//       config: [, portTypes],
//     },
//   ] = React.useContext(EditorContext);
//   const { label: defaultLabel, color } = portTypes[type] || {};

//   return (
//     <div
//       className={styles.transput}
//       data-controlless={true}
//       onDragStart={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//       }}
//     >
//       <label className={styles.portLabel}>{label || defaultLabel}</label>
//       <Port
//         type={type}
//         color={color ?? "blue"}
//         name={name}
//         nodeId={nodeId}
//         recalculate={recalculate}
//         portTypes={portTypes}
//       />
//     </div>
//   );
// };

// type PortProps = {
//   color: string;
//   type: string;
//   name: string;
//   isInput?: boolean;
//   nodeId: string;
//   recalculate: () => void;
//   portTypes: portTypes;
// };

// /**
//  * This function takes a number and returns the number based on the zoom level.
//  * @param zoom - The current zoom level of the editor.
//  * @param value - Number to be based on the zoom level of the Editor.
//  */
// const byZoom = (zoom: number, value: number) => (1 / zoom) * value;

// type element = { x: number; width: number };

// const calculateNewCoordinateByZoom = (
//   zoom: number,
//   element: element,
//   stage: DOMRect,
//   coordinate: number
// ) => {
//   return (
//     byZoom(zoom, element.x - stage.x + element.width / 2 - stage.width / 2) +
//     byZoom(zoom, coordinate)
//   );
// };

// const calculateNewCoordinatesByZoom = (
//   zoom: number,
//   element: element,
//   stage: DOMRect,
//   coordinates: coordinates
// ): coordinates => [
//   calculateNewCoordinateByZoom(zoom, element, stage, coordinates[0]),
//   calculateNewCoordinateByZoom(zoom, element, stage, coordinates[1]),
// ];

// // const updateExistingConnection = (existingConnection: Element) => {
// //   //We make sure the parent element of the connection is always in the front.
// //   existingConnection.parentElement.style.zIndex = "9999";

// //   //We get the DOMRect of the DOM element of the Port the connection is coming from.
// //   const outputPort = getPortRect(
// //     existingConnection.dataset.outputNodeId,
// //     existingConnection.dataset.outputPortName,
// //     "output"
// //   );
// //   //Return if it does not exist.
// //   if (!outputPort) return;

// //   return calculateNewCoordinatesByZoom(zoom, outputPort, stage, coordinates);
// // };

// const Port: React.FC<PortProps> = ({
//   color = "grey",
//   name = "",
//   type,
//   isInput,
//   nodeId,
//   recalculate,
//   portTypes,
// }) => {
//   const [
//     { id, zoom, coordinates: editorCoordinates },
//     dispatch,
//   ] = React.useContext(EditorContext);
//   const stageId = `${STAGE_ID}${id}`;
//   const [isDragging, setIsDragging] = React.useState(false);
//   const [coordinates, setCoordinates] = React.useState<coordinates>([0, 0]);

//   const port = React.useRef<HTMLDivElement>(null);
//   const line = React.useRef<SVGPathElement>(null);

//   const stage = document?.getElementById(stageId)?.getBoundingClientRect();

//   const portGestures = useGesture({
//     onDragStart: ({ event }) => {
//       event.stopPropagation();

//       //The startPort is the port that the user clicked on and dragged away from.
//       const element = port?.current?.getBoundingClientRect();
//       //The stage is the Stage on which all elements and connections are layed out.

//       if (!element || !stage) return;

//       setCoordinates(
//         calculateNewCoordinatesByZoom(zoom, element, stage, coordinates)
//       );
//       setIsDragging(true);
//     },
//     onDrag: ({ movement: [x] }) => {
//       if (!stage) return;
//       const to: coordinates = calculateNewCoordinatesByZoom(
//         zoom,
//         { width: stage.width, x },
//         stage,
//         coordinates
//       );

//       line?.current?.setAttribute("d", calculateCurve([coordinates, to])!);
//     },
//     onDragEnd: ({ event }) => {
//       const droppedOnPort = !!event.target.dataset.portName;
//     },
//   });

//   // const handleDragEnd = (e: MouseEvent) => {
//   //   //First we make sure that the received event is of the right type, because we depend on certain properties to be available.
//   //   if (!(e.target instanceof HTMLDivElement)) return;

//   //   //Next we check whether the Connection has been dropped on another port. If it has not been we simply remove the Connection, because no connection of two ports should be established.
//   //   const droppedOnPort = !!e.target.dataset.portName;

//   //   //Now we need to make sure that the Connection origin is actually an input, because only inputs are supposed to create connections. Additionally we verify that existingConnection is actually defined.
//   //   if (isInput && existingConnection?.current) {
//   //     //We need to know about the data- properties set on the underlying HTML element to identify the
//   //     const {
//   //       inputNodeId,
//   //       inputPortName,
//   //       outputNodeId,
//   //       outputPortName,
//   //     } = existingConnection.current.dataset;

//   //     if (!inputNodeId || !inputPortName || !outputNodeId || !outputPortName)
//   //       return;

//   //     dispatch({
//   //       type: "REMOVE_CONNECTION",
//   //       input: { nodeId: inputNodeId, portName: inputPortName },
//   //       output: { nodeId: outputNodeId, portName: outputPortName },
//   //     });

//   //     if (droppedOnPort) {
//   //       const {
//   //         portName: connectToPortName,
//   //         nodeId: connectToNodeId,
//   //         portType: connectToPortType,
//   //         portTransputType: connectToTransputType,
//   //       } = e.target.dataset;

//   //       const isNotSameNode = outputNodeId !== connectToNodeId;

//   //       if (isNotSameNode && connectToTransputType !== "output") {
//   //         const inputWillAcceptConnection = connectToPortType
//   //           ? portTypes[connectToPortType]?.acceptTypes?.includes(type)
//   //           : null;

//   //         if (
//   //           inputWillAcceptConnection &&
//   //           connectToNodeId &&
//   //           connectToPortName &&
//   //           outputNodeId &&
//   //           outputPortName
//   //         ) {
//   //           setIsDragging(false);
//   //           dispatch({
//   //             type: "ADD_CONNECTION",
//   //             input: { nodeId: connectToNodeId, portName: connectToPortName },
//   //             output: { nodeId: outputNodeId, portName: outputPortName },
//   //           });
//   //         }
//   //       }
//   //     }
//   //   } else {
//   //     if (droppedOnPort) {
//   //       const {
//   //         portName: inputPortName,
//   //         nodeId: inputNodeId,
//   //         portType: inputNodeType,
//   //         portTransputType: inputTransputType,
//   //       } = e.target.dataset;

//   //       const isNotSameNode = inputNodeId !== nodeId;

//   //       if (isNotSameNode && inputTransputType !== "output") {
//   //         const inputWillAcceptConnection = inputNodeType
//   //           ? portTypes[inputNodeType]?.acceptTypes?.includes(type)
//   //           : null;

//   //         if (inputWillAcceptConnection && inputNodeId && inputPortName) {
//   //           setIsDragging(false);
//   //           dispatch({
//   //             type: "ADD_CONNECTION",
//   //             output: { nodeId, portName: name },
//   //             input: { nodeId: inputNodeId, portName: inputPortName },
//   //           });
//   //           recalculate();
//   //         }
//   //       }
//   //     }
//   //   }

//   //   document.removeEventListener("mouseup", handleDragEnd);
//   //   document.removeEventListener("mousemove", handleDrag);
//   // };

//   return (
//     <React.Fragment>
//       <div
//         style={{ zIndex: 999 }}
//         className={styles.port}
//         data-port-color={color}
//         data-port-name={name}
//         data-port-type={type}
//         data-port-transput-type={isInput ? "input" : "output"}
//         data-node-id={nodeId}
//         ref={port}
//         {...portGestures()}
//       />
//       {isDragging && !isInput ? (
//         <Portal node={document.getElementById(`${DRAG_CONNECTION_ID}${id}`)}>
//           <Connection from={coordinates} to={coordinates} lineRef={line} />
//         </Portal>
//       ) : null}
//     </React.Fragment>
//   );
// };
