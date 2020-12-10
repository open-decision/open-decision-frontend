import styles from "../components/Connection/Connection.module.css";
import { line, curveBasis } from "d3-shape";
import { coordinates } from "@globalTypes/types";
import { CONNECTIONS_ID } from "@utilities/index";
import { EditorState } from "reducers";

const getPort = (nodeId: string, portName: string, transputType = "input") =>
  document.querySelector(
    `[data-node-id="${nodeId}"] [data-port-name="${portName}"][data-port-transput-type="${transputType}"]`
  );

export const getPortRect = (
  nodeId: string,
  portName: string,
  transputType = "input"
): DOMRect | undefined =>
  getPort(nodeId, portName, transputType)?.getBoundingClientRect() ?? undefined;

export const calculateCurve = (from: coordinates, to: coordinates): string => {
  const length = to.x - from.x;
  const thirdLength = length / 3;
  const curve = line().curve(curveBasis)([
    [from.x, from.y],
    [from.x + thirdLength, from.y],
    [from.x + thirdLength * 2, to.y],
    [to.x, to.y],
  ]);
  return curve;
};

export const deleteConnection = (id: string): void => {
  const line = document.querySelector(`[data-connection-id="${id}"]`);
  if (line) line.parentElement.remove();
};

export const deleteConnectionsByNodeId = (nodeId: string): void => {
  const lines = document.querySelectorAll(
    `[data-output-node-id="${nodeId}"], [data-input-node-id="${nodeId}"]`
  );

  lines.forEach((line) => line.parentElement.remove());
};

export const updateConnection = ({
  line,
  from,
  to,
}: {
  line: Element;
  from: coordinates;
  to: coordinates;
}): void => {
  line.setAttribute("d", calculateCurve(from, to));
};

export const createSVG = ({
  from,
  to,
  stage,
  id,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}: {
  from: coordinates;
  to: coordinates;
  stage: HTMLElement;
  id: string;
  outputNodeId: string;
  outputPortName: string;
  inputNodeId: string;
  inputPortName: string;
}): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", styles.svg);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const curve = calculateCurve(from, to);
  path.setAttribute("d", curve);
  path.setAttribute("stroke", "rgb(185, 186, 189)");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("fill", "none");
  path.setAttribute("data-connection-id", id);
  path.setAttribute("data-output-node-id", outputNodeId);
  path.setAttribute("data-output-port-name", outputPortName);
  path.setAttribute("data-input-node-id", inputNodeId);
  path.setAttribute("data-input-port-name", inputPortName);
  svg.appendChild(path);
  stage.appendChild(svg);
  return svg;
};

export const getStageRef = (editorId: string): HTMLElement =>
  document.getElementById(`${CONNECTIONS_ID}${editorId}`);

export const createConnections = (
  { nodes, zoom }: EditorState,
  editorId: string
): void => {
  const stageRef = getStageRef(editorId);
  if (stageRef) {
    const stage = stageRef.getBoundingClientRect();
    const stageHalfWidth = stage.width / 2;
    const stageHalfHeight = stage.height / 2;

    const byScale = (value: number) => (1 / zoom) * value;

    Object.values(nodes).forEach((node) => {
      if (node.connections && node.connections.inputs) {
        Object.entries(node.connections.inputs).forEach(
          ([inputName, outputs]) => {
            outputs.forEach((output) => {
              const fromPort = getPortRect(
                output.nodeId,
                output.portName,
                "output"
              );
              const toPort = getPortRect(node.id, inputName, "input");
              const portHalf = fromPort ? fromPort.width / 2 : 0;
              if (fromPort && toPort) {
                const id =
                  output.nodeId + output.portName + node.id + inputName;
                const existingLine = document.querySelector(
                  `[data-connection-id="${id}"]`
                );
                if (existingLine) {
                  updateConnection({
                    line: existingLine,
                    from: {
                      x: byScale(
                        fromPort.x - stage.x + portHalf - stageHalfWidth
                      ),
                      y: byScale(
                        fromPort.y - stage.y + portHalf - stageHalfHeight
                      ),
                    },
                    to: {
                      x: byScale(
                        toPort.x - stage.x + portHalf - stageHalfWidth
                      ),
                      y: byScale(
                        toPort.y - stage.y + portHalf - stageHalfHeight
                      ),
                    },
                  });
                } else {
                  createSVG({
                    id,
                    outputNodeId: output.nodeId,
                    outputPortName: output.portName,
                    inputNodeId: node.id,
                    inputPortName: inputName,
                    from: {
                      x: byScale(
                        fromPort.x - stage.x + portHalf - stageHalfWidth
                      ),
                      y: byScale(
                        fromPort.y - stage.y + portHalf - stageHalfHeight
                      ),
                    },
                    to: {
                      x: byScale(
                        toPort.x - stage.x + portHalf - stageHalfWidth
                      ),
                      y: byScale(
                        toPort.y - stage.y + portHalf - stageHalfHeight
                      ),
                    },
                    stage: stageRef,
                  });
                }
              }
            });
          }
        );
      }
    });
  }
};
