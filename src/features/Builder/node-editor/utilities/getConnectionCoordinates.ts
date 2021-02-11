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
  node.coordinates[0] + node.width - 2,
  node.coordinates[1] + node.height / 2,
];

/**
 * Calculates the coordinates between two Nodes when provided with the information of the nodes.
 * @param node1
 * @param node2
 */
export const getConnectionCoordinates = (
  node1: nodePositionalData,
  node2: nodePositionalData
): connectionCoordinates => [
  calculateInputCoordinate(node1),
  calculateOutputCoordinate(node2),
];
