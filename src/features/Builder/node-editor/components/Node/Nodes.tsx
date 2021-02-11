import React from "react";
import shallow from "zustand/shallow";
import { useNodesStore } from "../../globalState";
import { Node } from "./Node";

/**
 * This component is a wrapper for all the nodes. It simply manages getting the node id's from state and rendering individuel Nodes.
 */
export const Nodes: React.FC = () => {
  //Here we get the nodes id's. We are making a shallow comparison, because we only want to rerender the wrapper when the actual keys of the nodes change.
  const nodes = useNodesStore((state) => Object.keys(state.nodes), shallow);

  return (
    <div>
      {/* Here we render the nodes. Each node only receives an id. The Node component is responsible to get the data it needs from the store. */}
      {nodes.map((node) => (
        <Node id={node} key={node} />
      ))}
    </div>
  );
};
