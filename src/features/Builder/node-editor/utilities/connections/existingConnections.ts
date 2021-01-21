import { Connection } from "../../types";
import { calculateCurve } from "./shared";
import { connectionCoordinates } from "./types";

export const deleteConnection = (id: string): void => {
  const line = document.querySelector(`[data-connection-id="${id}"]`);
  line?.parentElement?.remove();
};

export const deleteConnectionsByNodeId = (nodeId: string): void => {
  const lines = document.querySelectorAll(
    `[data-output-node-id="${nodeId}"], [data-input-node-id="${nodeId}"]`
  );

  lines.forEach((line) => line?.parentElement?.remove());
};

export const updateConnection = (
  line: Element,
  connectionCoordinates: connectionCoordinates
): void => {
  const newCurve = calculateCurve(connectionCoordinates);

  newCurve && line.setAttribute("d", newCurve);
};

export const getExistingConnection = (
  nodeId: string,
  portName: string,
  connection: Connection,
  isOutput?: boolean
): Element | null => {
  const getElement = (id: string) =>
    document.querySelector(`[data-connection-id="${id}"]`);

  if (isOutput) {
    return getElement(
      nodeId + portName + connection.nodeId + connection.portName
    );
  }

  return getElement(
    connection.nodeId + connection.portName + nodeId + portName
  );
};
