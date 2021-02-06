import React from "react";
import { Portal } from "react-portal";
import { useEdgesStore } from "../../globalState/stores";
import { coordinates } from "../../types";
import { calculateCurve } from "../../utilities/connections/shared";
import { Connection } from "../Connections/Connection";

type Port = React.FC<React.HTMLAttributes<HTMLDivElement> & { nodeId: string }>;

export const Port: Port = ({ children, className, nodeId }) => {
  const addEdge = useEdgesStore((state) => state.addEdge);
  const connectionRef = React.useRef<SVGPathElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);

    document.addEventListener("pointerup", handleDragEnd);
    document.addEventListener(
      "pointermove",
      handleDrag([event.clientX, event.clientY])
    );
  };

  const handleDrag = (origin: coordinates) => (event: PointerEvent) => {
    const newCurve = calculateCurve([[event.clientX, event.clientY], origin]);
    newCurve && connectionRef.current?.setAttribute("d", newCurve);
  };

  const handleDragEnd = (event: PointerEvent) => {
    setDragging(false);
    if (!(event.target instanceof HTMLElement)) return;

    const receivingNodeId = event.target?.dataset.nodeId;
    receivingNodeId && addEdge(receivingNodeId, nodeId);

    document.removeEventListener("pointerup", handleDragEnd);
    document.removeEventListener("pointermove", handleDrag([0, 0]));
  };

  return (
    <div
      onPointerDown={handleDragStart}
      className={className}
      data-node-id={nodeId}
    >
      {children}
      {dragging && (
        <Portal>
          <Connection ref={connectionRef} />
        </Portal>
      )}
    </div>
  );
};

Port.displayName = "Port";
