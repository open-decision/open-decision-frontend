import { ChatOutline } from "@graywolfai/react-heroicons";
import React from "react";

type ToolbarNode = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    color?: string;
  }
>;

export const ToolbarNode: ToolbarNode = ({ label, color, ...props }) => {
  return (
    <button
      style={{ borderColor: color }}
      className="bg-gray-100 p-4 rounded shadow-md border-l-4 flex items-center"
      {...props}
    >
      <ChatOutline
        style={{ width: "1.5em", color: color ?? "black" }}
        className="mr-2 rounded"
      />
      {label}
    </button>
  );
};
