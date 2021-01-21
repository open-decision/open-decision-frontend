import { coordinates, Nodes } from "../types";
import {
  getExistingConnection,
  updateConnection,
} from "./connections/existingConnections";
import { createSVGConnection } from "./connections/newConnections";
import {
  getConnectionCoordinates,
  getConnectionPorts,
} from "./connections/shared";

type createConnections = (
  nodes: Nodes,
  zoom: number,
  id: string,
  stageRect: React.MutableRefObject<DOMRect | null>,
  stageCoordinates: coordinates
) => void;

export const createConnections: createConnections = (
  nodes,
  zoom,
  id,
  stageRect,
  stageCoordinates
) => {
  Object.values(nodes).forEach((node) => {
    if (node.connections && node.connections.inputs) {
      Object.entries(node.connections.inputs).forEach(
        ([inputName, outputs]) => {
          outputs.forEach((output) => {
            const existingConnection = getExistingConnection(
              node.id,
              output.portName,
              output,
              true
            );

            const connectionPorts = getConnectionPorts(
              output,
              true,
              node.id,
              output.portName
            );

            const portHalf = connectionPorts ? connectionPorts[0].width / 2 : 0;

            if (connectionPorts) {
              if (existingConnection)
                return updateConnection(
                  existingConnection,
                  getConnectionCoordinates(
                    zoom,
                    connectionPorts,
                    stageRect,
                    portHalf,
                    stageCoordinates
                  )
                );

              return createSVGConnection({
                id,
                outputNodeId: output.nodeId,
                outputPortName: output.portName,
                inputNodeId: node.id,
                inputPortName: inputName,
                connectionCoordinates: getConnectionCoordinates(
                  zoom,
                  connectionPorts,
                  stageRect,
                  portHalf,
                  stageCoordinates
                ),
                stage: stageRect,
              });
            }
          });
        }
      );
    }
  });
};
