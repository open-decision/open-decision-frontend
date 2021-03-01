import clsx from "clsx";
import React from "react";
import {
  DesktopComputerOutline,
  BriefcaseOutline,
  FolderOutline,
} from "@graywolfai/react-heroicons";
import { useEditorStore, useNodesStore } from "../../globalState";
import { pick } from "remeda";
import { ToolbarNode } from "./ToolbarNode";
import { nanoid } from "nanoid/non-secure";
import type { coordinates } from "@internalTypes/types";

const turnNumberIntoOpposite = (number: number) =>
  number > 0 ? -number : Math.abs(number);

const getCenterOfStage = (
  coordinates: coordinates,
  zoom: number
): coordinates => [
  turnNumberIntoOpposite(coordinates[0] / zoom),
  turnNumberIntoOpposite(coordinates[1] / zoom),
];

type NewNodeToolbar = React.FC<React.HTMLAttributes<HTMLDivElement>>;

export const NewNodeToolbar: NewNodeToolbar = ({ className, ...props }) => {
  const nodeTypes = useNodesStore((state) => state.nodeTypes);
  const options = Object.values(nodeTypes).map((nodeType) =>
    pick(nodeType, ["label", "color", "type", "width"])
  );

  const addNode = useNodesStore((state) => state.addNode);
  const [stageCoordinates, zoom] = useEditorStore((state) => [
    state.coordinates,
    state.zoom,
  ]);
  const centerOfStage = getCenterOfStage(stageCoordinates, zoom);

  return (
    <div
      className={clsx("w-80 bg-gray-100 flex shadow-xl z-10", className)}
      {...props}
    >
      <div className="bg-gray-300 shadow-xl px-2 py-5 flex flex-col items-center space-y-4">
        <button className="flex flex-col items-center">
          <BriefcaseOutline style={{ width: "2em" }} />
          Package
        </button>
        <button className="flex flex-col items-center">
          <DesktopComputerOutline style={{ width: "2em" }} />
          Tech
        </button>
        <button className="flex flex-col items-center">
          <FolderOutline style={{ width: "2em" }} />
          Other
        </button>
      </div>
      <div className=" flex flex-col w-full space-y-6 p-4">
        {options.map((option) => (
          <ToolbarNode
            key={option.label}
            label={option.label}
            color={option.color}
            onClick={() => addNode(option.type, centerOfStage, nanoid(5))}
          />
        ))}
      </div>
    </div>
  );
};
