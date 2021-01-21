import styles from "../../components/Connection/Connection.module.css";
import { calculateCurve } from "./shared";
import { connectionCoordinates } from "./types";

export const createSVGConnection = ({
  connectionCoordinates,
  stage,
  id,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}: {
  connectionCoordinates: connectionCoordinates;
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
  const curve = calculateCurve(connectionCoordinates);

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

  // stage.appendChild(svg);
  return svg;
};
