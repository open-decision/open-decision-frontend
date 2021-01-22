import { connectionCoordinates, coordinates, nodeInformation } from "../types";

const calculateCoordinate = (node: nodeInformation): coordinates => [
  node.coordinates[0] + node.width / 2,
  node.coordinates[1] + node.height / 2,
];

export const getConnectionCoordinates = (
  originNode: nodeInformation,
  destinationNode: nodeInformation
): connectionCoordinates => [
  calculateCoordinate(originNode),
  calculateCoordinate(destinationNode),
];
