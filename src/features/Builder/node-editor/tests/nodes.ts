import { Nodes, NodeTypes, PortTypes } from "../types";
import { connectionCoordinates } from "../utilities/connections/types";

export const exampleNodes: Nodes = {
  "5nCLb85WDw": {
    id: "5nCLb85WDw",
    coordinates: [134.5, -90],
    type: "addNumbers",
    width: 150,
  },
  vRPQ06k4nT: {
    id: "vRPQ06k4nT",
    coordinates: [-182.5, -176],
    type: "number",
    width: 150,
  },
  BDhQ98lTfw: {
    id: "BDhQ98lTfw",
    coordinates: [-181.5, -42],
    type: "number",
    width: 150,
  },
};

export type edge = {
  nodeId: string;
  portName: string;
  connectionCoordinates?: connectionCoordinates;
};
export type edges = Record<string, edge[]>;

export const exampleEdges: edges = {
  "5nCLb85WDw": [
    { nodeId: "vRPQ06k4nT", portName: "number" },
    { nodeId: "BDhQ98lTfw", portName: "number" },
  ],
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
