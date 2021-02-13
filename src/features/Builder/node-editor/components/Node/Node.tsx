import React from "react";
import { useDrag } from "react-use-gesture";
import {
  useEdgesStore,
  useEditorStore,
  useNodesStore,
} from "../../globalState";
import shallow from "zustand/shallow";
import { ChatOutline, PlusOutline } from "@graywolfai/react-heroicons";
import { getOutputConnections } from "./utilities";
import { Port } from "./Port";
import { useModalState } from "./useModal";

type NodeProps = {
  /**
   * The Node only gets the id of the node it is supposed to render. It takes care of getting the data it needs about the node itself.
   */
  id: string;
};

export const Node: React.FC<NodeProps> = ({ id }) => {
  // Here we get all the data and functions, that we need, from state.
  const nodeTypes = useNodesStore((state) => state.nodeTypes, shallow);
  const outputConnections = useEdgesStore(getOutputConnections(id));

  const setNode = useNodesStore((state) => state.setNode);
  const node = useNodesStore((state) => state.nodes[id]);
  const zoom = useEditorStore((state) => state.zoom);

  const setMenuOpen = useModalState((state) => state.openModal);

  // Get the shared information for a Node of this type from the NodeTypes.
  const { color } = nodeTypes[node.type];

  const ref = React.useRef(null);

  //-----------------------------------------------------------------------
  //This is the drag gesture of the node. It updates the Node state when the Node is dragged. The initial start position of the Node come from the coordinates in the nodes state. We transform the data produced by the drag operation by dividing it with the editor zoom. This makes sure that we keep the Node under the mouse when dragging.
  const nodeGestures = useDrag(
    ({ movement, event }) => {
      event.stopPropagation();
      setNode(id, { ...node, coordinates: movement });
    },
    { initial: node.coordinates, transform: ([x, y]) => [x / zoom, y / zoom] }
  );

  return (
    <div
      style={{
        transform: `translate(${node.coordinates[0]}px, ${node.coordinates[1]}px)`,
        gridTemplateColumns: `10px 10px ${node.width - 40}px 10px 10px`,
        gridTemplateRows: node.height,
      }}
      className="absolute left-0 top-0 grid"
    >
      {/* This is the body of the Node. */}
      <div
        className="bg-gray-100 rounded shadow-lg flex flex-col select-none border-l-4 hover:shadow-xl transition-shadow duration-200 col-start-2 col-end-5 row-span-full opacity-80"
        style={{ borderLeftColor: color ?? "gray" }}
        id={id}
        data-node-id={id}
        {...nodeGestures()}
      >
        <div className="p-1 flex items-center text-lg">
          <ChatOutline
            style={{ width: "2.5em", color: color ?? "black" }}
            className="mr-2 rounded py-4 px-2"
          />
          <h2 className="font-semibold">{id}</h2>
        </div>
      </div>
      {/* These are the Ports of the Nodes. There is only one Port on each side. The Output Port can also be an unconnected port. This port looks different and has a menu to create a new Node. Above we get the outputConnections and here we use them to decide which port to render. */}
      <Port
        nodeId={id}
        className="col-start-1 col-end-3 row-span-full self-center justify-self-center"
        variant="connected"
      />
      {outputConnections.length < 1 ? (
        <Port
          className="col-start-4 col-end-6 row-span-full self-center justify-self-center"
          nodeId={id}
          variant="unconnected"
        >
          <button
            onClick={(event) => {
              console.log(event.pageX, event.pageY);
              setMenuOpen([event.pageX, event.pageY], id);
            }}
            data-node-id={id}
            className="w-full h-full p-1"
            ref={ref}
          >
            <PlusOutline className="text-white" />
          </button>
        </Port>
      ) : (
        <Port
          nodeId={id}
          className="col-start-4 col-end-6 row-span-full self-center justify-self-center"
          variant="connected"
        />
      )}
    </div>
  );
};
