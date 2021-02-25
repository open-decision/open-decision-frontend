// import React from "react";
// import ReactFlow, { addEdge, removeElements } from "react-flow-renderer";

// const initialElements = [
//   {
//     id: "1",
//     type: "input", // input node
//     data: { label: "Input Node" },
//     position: { x: 250, y: 25 },
//   },
//   // default node
//   {
//     id: "2",
//     // you can also pass a React component as a label
//     data: { label: <h1 className="text-2xl">Default Node</h1> },
//     position: { x: 100, y: 125 },
//   },
//   {
//     id: "3",
//     type: "output", // output node
//     data: { label: "Output Node" },
//     position: { x: 250, y: 250 },
//   },
//   // animated edge
//   { id: "e1-2", source: "1", target: "2", label: "This is an edge label" },
//   { id: "e2-3", source: "2", target: "3" },
// ];

// export const Flow = () => {
//   const [elements, setElements] = React.useState(initialElements);
//   const onElementsRemove = (elementsToRemove) =>
//     setElements((els) => removeElements(elementsToRemove, els));
//   const onConnect = (params) => setElements((els) => addEdge(params, els));

//   return (
//     <ReactFlow
//       elements={elements}
//       onElementsRemove={onElementsRemove}
//       onConnect={onConnect}
//       deleteKeyCode={46}
//     />
//   );
// };
