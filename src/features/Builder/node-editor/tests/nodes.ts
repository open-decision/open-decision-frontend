import { Nodes, NodeTypes, PortTypes } from "../types";

export const exampleNodes: Nodes = {
  "5nCLb85WDw": {
    id: "5nCLb85WDw",
    coordinates: { x: 134.5, y: -90 },
    type: "addNumbers",
    width: 150,
    connections: {
      inputs: {
        num1: [{ nodeId: "vRPQ06k4nT", portName: "number" }],
        num2: [],
      },
      outputs: {},
    },
  },
  vRPQ06k4nT: {
    id: "vRPQ06k4nT",
    coordinates: { x: -182.5, y: -176 },
    type: "number",
    width: 150,
    connections: {
      inputs: {},
      outputs: { number: [{ nodeId: "5nCLb85WDw", portName: "num1" }] },
    },
  },
  BDhQ98lTfw: {
    id: "BDhQ98lTfw",
    coordinates: { x: -181.5, y: -42 },
    type: "number",
    width: 150,
    connections: {
      inputs: {},
      outputs: {},
    },
  },
};

export const portTypes: PortTypes = {
  number: {
    type: "number",
    label: "Number",
    name: "number",
    acceptTypes: ["number"],
    color: "red",
  },
};

export const nodeTypes: NodeTypes = {
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
