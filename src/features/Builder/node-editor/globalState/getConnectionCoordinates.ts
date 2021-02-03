import { connectionCoordinates, coordinates, nodeInformation } from "../types";

const calculateInputCoordinate = (node: nodeInformation): coordinates => [
  node.coordinates[0] + 2,
  node.coordinates[1] + node.height / 2,
];

const calculateOutputCoordinate = (node: nodeInformation): coordinates => [
  node.coordinates[0] + node.width + 38,
  node.coordinates[1] + node.height / 2,
];

export const getConnectionCoordinates = (
  originNode: nodeInformation,
  destinationNode: nodeInformation
): connectionCoordinates => [
  calculateInputCoordinate(originNode),
  calculateOutputCoordinate(destinationNode),
];
