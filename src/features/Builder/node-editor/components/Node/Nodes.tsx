import React from "react";
import shallow from "zustand/shallow";
import { useNodesStore } from "../../globalState/stores";
import { Node } from "./Node";

export const Nodes = () => {
  const nodes = useNodesStore((state) => Object.keys(state.nodes), shallow);

  return (
    <div>
      {nodes.map((node) => (
        <Node id={node} key={node} />
      ))}
    </div>
  );
};
