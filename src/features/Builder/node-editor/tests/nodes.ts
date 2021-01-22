import { edges, nodes, nodeTypes, portTypes } from "../types";

export const exampleNodes: nodes = {
  node1: {
    id: "node1",
    coordinates: [134.5, -90],
    type: "addNumbers",
    width: 150,
    height: 20,
  },
  node2: {
    id: "node2",
    coordinates: [-182.5, -176],
    type: "number",
    width: 150,
    height: 20,
  },
  node3: {
    id: "node3",
    coordinates: [-181.5, -42],
    type: "number",
    width: 150,
    height: 20,
  },
  node4: {
    id: "node4",
    coordinates: [-170.5, -80],
    type: "number",
    width: 150,
    height: 20,
  },
  node5: {
    id: "node5",
    coordinates: [-1120, -20],
    type: "number",
    width: 150,
    height: 20,
  },
  node6: {
    id: "node6",
    coordinates: [50, 40],
    type: "number",
    width: 150,
    height: 20,
  },
};

export const exampleEdges: edges = {
  node1: [{ nodeId: "node2", portName: "number" }],
  node3: [{ nodeId: "node2", portName: "number" }],
  node5: [{ nodeId: "node6", portName: "number" }],
};

export const portTypes: portTypes = {
  number: {
    type: "number",
    label: "Number",
    name: "number",
    acceptTypes: ["number"],
    color: "red",
  },
};

export const nodeTypes: nodeTypes = {
  number: {
    type: "number",
    label: "Number",
    addable: true,
    deletable: true,
    description: "",
    root: false,
    sortPriority: 1,
    inputPorts: [
      { type: "number", label: "test", color: "blue", name: "number" },
    ],
    outputPorts: [
      {
        type: "number",
        label: "test",
        color: "blue",
        name: "number",
      },
    ],
  },
  addNumbers: {
    type: "addNumbers",
    label: "Add Numbers",
    addable: true,
    deletable: true,
    description: "",
    root: false,
    sortPriority: 1,
    inputPorts: [
      {
        type: "number",
        label: "test",
        color: "blue",
        name: "num1",
      },
      {
        type: "number",
        label: "test",
        color: "blue",
        name: "num2",
      },
    ],
    outputPorts: [
      { type: "number", label: "test", color: "blue", name: "number" },
    ],
  },
};
