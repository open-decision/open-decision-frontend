import { curveBasis, line } from "d3-shape";
import { connectionCoordinates } from "../../types";

export const calculateCurve = (
  connectionCoordinates: connectionCoordinates
): string | null => {
  const [origin, destination] = connectionCoordinates;
  const length = origin[0] - destination[0];

  return line().curve(curveBasis)([
    [origin[0], origin[1]],
    [origin[0] - length / 3, origin[1]],
    [destination[0] + length / 3, destination[1]],
    [destination[0], destination[1]],
  ]);
};
