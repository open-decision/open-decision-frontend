import clsx from "clsx";
import React from "react";

type Connection = React.SVGAttributes<SVGElement> & {
  curve?: string;
  hovered?: boolean;
  enableEvents?: boolean;
};

export const Connection = React.forwardRef<SVGPathElement, Connection>(
  ({ curve, hovered = false, enableEvents = false, ...props }, ref) => {
    return (
      <svg
        className={clsx(
          "absolute left-0 top-0 overflow-visible",
          !enableEvents && "pointer-events-none"
        )}
        fill="none"
        {...props}
      >
        <path
          d={curve}
          strokeWidth={20}
          visibility="visible"
          stroke="transparent"
        />
        <path
          stroke={hovered ? "red" : "rgb(185, 186, 189)"}
          strokeWidth={3}
          strokeLinecap="round"
          d={curve}
          ref={ref}
        />
      </svg>
    );
  }
);

Connection.displayName = "Connection";
