import React from "react";
import { calculateCurve } from "@utilities/index";
import styles from "./Connection.module.css";

type ConnectionProps = {
  from;
  to;
  id?;
  lineRef;
  outputNodeId?;
  outputPortName?;
  inputNodeId?;
  inputPortName?;
};

const Connection: React.FC<ConnectionProps> = ({
  from,
  to,
  id,
  lineRef,
  outputNodeId,
  outputPortName,
  inputNodeId,
  inputPortName,
}) => {
  const curve = calculateCurve(from, to);
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
        d={curve}
        ref={lineRef}
      />
    </svg>
  );
};

export default Connection;
