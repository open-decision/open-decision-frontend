import { edges, nodes, nodeTypes, portTypes } from "../types";

export const exampleNodes: nodes = {
  node1: {
    coordinates: [200, -200],
    type: "addNumbers",
    width: 250,
    height: 100,
    name: "Addiere zwei Zahlen",
  },
  node2: {
    coordinates: [-200, -176],
    type: "number",
    width: 250,
    height: 100,
    name: "Irgendwas mit Nummer",
  },
  node3: {
    coordinates: [181.5, -42],
    type: "number",
    width: 250,
    height: 100,
    name: "Whatever",
  },
  node6: {
    coordinates: [-200, 40],
    type: "number",
    width: 250,
    height: 100,
    name: "Test",
  },
};

export const exampleEdges: edges = {
  node2: [{ nodeId: "node1" }, { nodeId: "node3" }],
  node6: [{ nodeId: "node3" }],
};

export const examplePortTypes: portTypes = {
  number: {
    type: "number",
    label: "Number",
    name: "number",
    acceptTypes: ["number"],
    color: "red",
  },
};

export const exampleNodeTypes: nodeTypes = {
  number: {
    type: "number",
    label: "Number",
    color: "#9333EA",
    addable: true,
    deletable: true,
    description: "",
    root: false,
    sortPriority: 1,
    width: 250,
    height: 100,
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
    color: "#22C55E",
    deletable: true,
    description: "",
    root: false,
    sortPriority: 1,
    width: 250,
    height: 100,
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
