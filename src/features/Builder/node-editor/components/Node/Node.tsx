import React from "react";
import { useGesture } from "react-use-gesture";
import { useEditorStore, useNodesStore } from "../../globalState/stores";
import shallow from "zustand/shallow";
import { ChatOutline } from "@graywolfai/react-heroicons";
import { Port } from "./Port";

type NodeProps = {
  id: string;
};

export const Node: React.FC<NodeProps> = ({ id, ...props }) => {
  const nodeTypes = useNodesStore((state) => state.nodeTypes, shallow);

  const setNode = useNodesStore((state) => state.setNode);
  const node = useNodesStore((state) => state.nodes[id]);
  const zoom = useEditorStore((state) => state.editorConfig.zoom);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { label, deletable, color } = nodeTypes[node.type];

  const nodeGestures = useGesture(
    {
      onDrag: ({ movement, event }) => {
        event.stopPropagation();
        setNode(id, { ...node, coordinates: movement, dragging: true });
      },
      onDragEnd: () => {
        setNode(id, { ...node, dragging: false });
      },
    },
    {
      drag: {
        initial: node.coordinates,
        transform: ([x, y]) => [x / zoom, y / zoom],
      },
    }
  );

  return (
    <div
      style={{
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
        gridTemplateColumns: `10px 10px ${node.width}px 10px 10px`,
        gridTemplateRows: node.height,
      }}
      className="z-10 absolute left-0 top-0 grid"
    >
      <div
        className="bg-gray-100 rounded shadow-lg flex flex-col select-none border-l-4 hover:shadow-xl transition-shadow duration-200 col-start-2 col-end-5 row-span-full"
        style={{
          borderLeftColor: color ?? "gray",
        }}
        id={id}
        {...nodeGestures()}
        {...props}
      >
        <div className="p-1 flex items-center text-lg">
          <ChatOutline
            style={{ width: "2.5em", color: color ?? "black" }}
            className="mr-2 rounded py-4 px-2"
          />
          <h2 className="font-semibold">{id}</h2>
        </div>
      </div>
      <Port className="col-start-1 col-end-3 row-span-full self-center justify-self-center" />
      <Port className="col-start-4 col-end-6 row-span-full self-center justify-self-center" />
    </div>
  );
};
