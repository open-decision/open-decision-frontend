import React from "react";
import { pick } from "remeda";
import { useEdgesStore, useNodesStore } from "../../globalState/stores";
import { NewspaperOutline } from "@graywolfai/react-heroicons";
import clsx from "clsx";
import { coordinates } from "../../types";
import { nanoid } from "nanoid/non-secure";

type NewNodeMenu = React.FC<{
  className: string;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  originNodeId: string;
}>;

export const NewNodeMenu: NewNodeMenu = ({
  className,
  setMenuOpen,
  originNodeId,
}) => {
  const nodeTypes = useNodesStore((state) => state.nodeTypes);
  const options = Object.values(nodeTypes).map((nodeType) =>
    pick(nodeType, ["label", "color", "type", "width"])
  );
  const coordinates = useNodesStore(
    (state) => state.nodes[originNodeId].coordinates
  );

  return (
    <div
      className={clsx(
        "bg-gray-100 rounded shadow-2xl border-gray-300 border-2 min-w-max",
        className
      )}
    >
      <h2 className="text-lg border-b-2 border-gray-30 p-2">
        Neuen Knoten hinzufügen
      </h2>
      <div className="pt-3 p-2 space-y-2">
        {options.map((option) => (
          <MenuEntry
            key={option.label}
            color={option.color}
            nodeType={option.type}
            coordinates={coordinates}
            width={option.width}
            setMenuOpen={setMenuOpen}
            originNodeId={originNodeId}
          >
            {option.label}
          </MenuEntry>
        ))}
      </div>
    </div>
  );
};

type MenuEntry = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    color?: string;
    nodeType: string;
    width: number;
    coordinates: coordinates;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    originNodeId: string;
  }
>;

const MenuEntry: MenuEntry = ({
  children,
  color,
  nodeType,
  coordinates,
  width,
  setMenuOpen,
  originNodeId,
  ...props
}) => {
  const addNode = useNodesStore((state) => state.addNode);
  const addEdge = useEdgesStore((state) => state.addEdge);

  const newNodeCoordinates: coordinates = [
    coordinates[0] + width + 150,
    coordinates[1],
  ];

  return (
    <button
      {...props}
      className="min-w-max w-full flex justify-start p-1 items-center rounded"
      onClick={() => {
        setMenuOpen(false);
        const newNodeId = nanoid(5);
        addNode(nodeType, newNodeCoordinates, newNodeId);
        addEdge(newNodeId, originNodeId);
      }}
    >
      <NewspaperOutline className="h-4 w-4 mr-2" style={{ color: color }} />
      {children}
    </button>
  );
};
