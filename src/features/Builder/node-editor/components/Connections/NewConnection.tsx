import React from "react";
import { Portal } from "react-portal";
import { useEdgesStore } from "../../globalState";
import { Connection } from "./Connection";

export const NewConnection = React.forwardRef<SVGPathElement>(({}, ref) => {
  const active = useEdgesStore((state) => state.newEdge.active);

  return active ? (
    <Portal>
      <Connection ref={ref} />
    </Portal>
  ) : (
    <></>
  );
});

NewConnection.displayName = "NewConnection";
