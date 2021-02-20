import clsx from "clsx";
import React from "react";
import { Portal } from "react-portal";
import { pipe, prop } from "remeda";
import { useEdgesStore } from "../../globalState";
import { coordinates } from "../../types";
import { calculateCurve } from "../../utilities";
import { Connection } from "../Connections/Connection";
const portVariants = {
  connected: "h-4 w-4 bg-blue-500",
  unconnected: "h-7 w-7 bg-red-500 clickable",
};

type Port = React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    variant: keyof typeof portVariants;
  }
>;

export const Port: Port = ({
  children,
  className,
  nodeId,
  variant,
  ...props
}) => {
  const connectionRef = React.useRef<SVGPathElement>(null);

  const addEdge = useEdgesStore((state) => state.addEdge);
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
    const newCurve = calculateCurve([origin, [event.clientX, event.clientY]]);
    newCurve && connectionRef.current?.setAttribute("d", newCurve);
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.removeEventListener("pointerup", handleDragEnd);
    document.removeEventListener("pointermove", handleDrag([0, 0]));
    addEdge(nodeId);
  };

  return (
    <div
      onPointerDown={handleDragStart}
      className={clsx(
        className,
        "rounded-full border-2 border-gray-200 shadow-md relative",
        pipe(portVariants, prop(variant))
      )}
      {...props}
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
