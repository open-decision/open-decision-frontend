import {
  connectionCoordinates,
  coordinates,
  nodePositionalData,
} from "../types";

/**
 * Gets the **input** port coordinate of a Node.
 * @param node - The data of the Node.
 */
const calculateInputCoordinate = (node: nodePositionalData): coordinates => [
  node.coordinates[0] + 2,
  node.coordinates[1] + node.height / 2,
];

/**
 * Gets the **output** port coordinate of a Node.
 * @param node - The data of the Node.
 */
const calculateOutputCoordinate = (node: nodePositionalData): coordinates => [
  node.coordinates[0] + node.width,
  node.coordinates[1] + node.height / 2,
];

/**
 * Calculates the coordinates between two Nodes when provided with the information of the nodes.
 * @param output
 * @param input
 */
export const getConnectionCoordinates = (
  output: nodePositionalData,
  input: nodePositionalData
): connectionCoordinates => [
  calculateOutputCoordinate(output),
  calculateInputCoordinate(input),
];
