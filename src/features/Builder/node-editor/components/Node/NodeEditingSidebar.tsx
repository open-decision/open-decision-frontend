import clsx from "clsx";
import React from "react";
import { useKeyPressEvent } from "react-use";
import { useNodesStore } from "../../globalState";
import { useSidebarState } from "./useSidebar";
import { ChevronRightOutline } from "@graywolfai/react-heroicons";

type NodeEditingSidebar = React.FC<React.HTMLAttributes<HTMLDivElement>> & {
  className?: string;
};

export const NodeEditingSidebar: NodeEditingSidebar = ({
  className,
  style,
  ...props
}) => {
  const [nodeId, closeSidebar, nodeType] = useSidebarState((state) => [
    state.nodeId,
    state.closeSidebar,
    state.nodeType,
  ]);

  const config = useNodesStore((state) => state.nodeTypes[nodeType]);
  const [node, setNode] = useNodesStore((state) => [
    state.nodes[nodeId],
    state.setNode,
  ]);

  const ref = React.useRef<HTMLDivElement>(null);
  useKeyPressEvent("Escape", () => closeSidebar());

  return (
    <div
      className={clsx(
        "w-full p-6 shadow-md space-y-8 overflow-y-scroll",
        className
      )}
      style={style}
      ref={ref}
      {...props}
    >
      <header className="flex justify-between items-stretch space-x-4">
        <input
          className="text-xl font-semibold border-b-4 pb-1 bg-gray-100 flex-1"
          style={{ borderColor: config.color }}
          value={node.name}
          onChange={(event) => setNode(nodeId, { name: event.target.value })}
          maxLength={30}
        />
        <button
          className="w-9 bg-gray-300 text-gray-600 clickable p-2"
          onClick={() => closeSidebar()}
        >
          <ChevronRightOutline />
        </button>
      </header>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Unused Inputs</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Conditions</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Question</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Answers</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
    </div>
  );
};
