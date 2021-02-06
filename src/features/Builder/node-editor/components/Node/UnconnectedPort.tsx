import clsx from "clsx";
import React from "react";
import { NewNodeMenu } from "./NewNodeMenu";
import { useClickAway, useKeyPressEvent } from "react-use";
import { Port } from "./Port";
import { PlusOutline } from "@graywolfai/react-heroicons";

type UnconnectedPort = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    nodeId: string;
  }
>;

export const UnconnectedPort: UnconnectedPort = ({
  className,
  nodeId,
  ...props
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ref = React.useRef(null);

  useClickAway(ref, () => setMenuOpen(false));
  useKeyPressEvent("Escape", () => setMenuOpen(false));

  return (
    <Port className={clsx(className, "relative")} nodeId={nodeId}>
      <div ref={ref}>
        <button
          className={clsx(
            "rounded-full h-7 w-7 bg-red-500 border-2 border-gray-200 shadow-md flex clickable relative z-10"
          )}
          onClick={() => setMenuOpen(!menuOpen)}
          data-node-id={nodeId}
          {...props}
        >
          <PlusOutline className="text-white p-1" />
        </button>
        {menuOpen && (
          <NewNodeMenu
            className="absolute mt-2"
            setMenuOpen={setMenuOpen}
            originNodeId={nodeId}
          />
        )}
      </div>
    </Port>
  );
};
