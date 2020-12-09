import React from "react";
import { CONNECTIONS_ID } from "@utilities/index";
import styles from "./Connections.module.css";

export const Connections: React.FC<{ editorId: string }> = ({ editorId }) => {
  return (
    <div className={styles.svgWrapper} id={`${CONNECTIONS_ID}${editorId}`} />
  );
};
