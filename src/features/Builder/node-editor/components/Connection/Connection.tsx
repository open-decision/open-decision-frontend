import React from "react";
import styles from "./Connection.module.css";
import { calculateCurve } from "../../utilities/connections/shared";
import { connectionCoordinates } from "../../utilities/connections/types";

type ConnectionProps = {
  connectionCoordinates: connectionCoordinates;
  id?: string;
  outputNodeId?: string;
  outputPortName?: string;
  inputNodeId?: string;
  inputPortName?: string;
};

export const Connection: React.FC<ConnectionProps> = ({
  connectionCoordinates,
  id,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}) => {
  const curve = calculateCurve(connectionCoordinates);

  console.log("rendered Connection", id);

  return (
    <svg className={styles.svg}>
      <path
        data-connection-id={id}
        data-output-node-id={outputNodeId}
        data-output-port-name={outputPortName}
        data-input-node-id={inputNodeId}
        data-input-port-name={inputPortName}
        stroke="rgb(185, 186, 189)"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        d={curve!}
      />
    </svg>
  );
};
