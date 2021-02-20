import { curveBasis, line } from "d3-shape";
import { connectionCoordinates } from "../types";

const minimumDistanceFromPort = 15;

/**
 * Calculates the path for the svg connection between Ports.
 * @param connectionCoordinates - The coordinates of the start port and end port.
 */
export const calculateCurve = (
  connectionCoordinates: connectionCoordinates
): string | null => {
  const [output, input] = connectionCoordinates;

  /**
   * The distance between the Nodes on the x axis.
   */
  const length = input[0] - output[0];

  //The passed in array defines the coordinates of the curve.
  return line().curve(curveBasis)([
    output,
    //The next two coordinates make sure that a minimun distance from the port is maintained. This makes the curve look better.
    [output[0] + Math.max(length / 3, minimumDistanceFromPort), output[1]],
    [input[0] - Math.max(length / 3, minimumDistanceFromPort), input[1]],
    input,
  ]);
};
