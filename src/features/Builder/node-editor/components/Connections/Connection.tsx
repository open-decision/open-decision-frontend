import React from "react";

type Connection = React.SVGAttributes<SVGPathElement> & { curve?: string };

export const Connection = React.forwardRef<SVGPathElement, Connection>(
  ({ curve, ...props }, ref) => {
    return (
      <svg className="absolute left-0 top-0 pointer-events-none z-0 overflow-visible">
        <path
          stroke="rgb(185, 186, 189)"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          d={curve}
          ref={ref}
          {...props}
        />
      </svg>
    );
  }
);

Connection.displayName = "Connection";
