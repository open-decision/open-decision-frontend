//External Libraries
import React from "react";

//Components
import { Stage } from "./components/Stage/Stage";
// import { Comment } from "./components/Comment/Comment";
// import { Toaster } from "./components/Toaster/Toaster";

//Hooks and Functions
import { useEdgesStore, useEditorStore, useNodesStore } from "./globalState";
import { Nodes } from "./components/Node/Nodes";
import { ConnectionsWrapper } from "./components/Connections/ConnectionsWrapper";
import {
  comments,
  coordinates,
  edges,
  nodes,
  nodeTypes,
  portTypes,
} from "./types";
import { NewNodeToolbar } from "./components/NewNodeToolbar/NewNodeToolbar";
import { useModal } from "./components/Node/useModal";
import { NewNodeMenu } from "./components/Node/NewNodeMenu";
import { Portal } from "react-portal";
import shallow from "zustand/shallow";
import { useSidebarState } from "./components/Node/useSidebar";
import { NodeEditingSidebar } from "./components/Node/NodeEditingSidebar";

export type EditorState = {
  /**
   * The id of the Editor.
   */
  id: string;
  /**
   * The current zoom level.
   */
  zoom: number;
  /**
   * The current position of the Editor.
   */
  coordinates: coordinates;
  /**
   * The currently shown Nodes.
   */
  nodes: nodes;
  /**
   * The currently shown Nodes.
   */
  edges: edges;
  /**
   * The currently shown Comments.
   */
  comments: comments;
  /**
   * The preconfigured avaliable NodeTypes and PortTypes that can be added when using the node-editor.
   */
  nodeTypes: nodeTypes;
  portTypes: portTypes;
};

type NodeEditorProps = {
  /**
   * The state of the content in the Editor.
   */
  state: EditorState;
  setState?: (value: EditorState) => void;
  /**
   * Zooming can be disabled. False by default.
   */
  disableZoom?: boolean;
  /**
   * Panning can be disabled. False by default.
   */
  disablePan?: boolean;
  /**
   * The Editor can make sure, that circular connections between nodes are not possible. By default circular connections are prevented.
   */
  circularBehavior?: "prevent" | "warn" | "allow";
  debug?: boolean;
  /**
   * The zoom of the Editor. Ranges from 0.1 to 7.
   */
  zoom?: number;
  /**
   * Comments can be hidden dynamically. False by default.
   */
  hideComments?: boolean;
};

export const NodeEditor: React.FC<NodeEditorProps> = ({
  state,
  disableZoom = false,
  disablePan = false,
}) => {
  const [setCoordinates, setZoom] = useEditorStore(
    (state) => [state.setCoordinates, state.setZoom],
    shallow
  );

  const setNodes = useNodesStore((state) => state.setNodes, shallow);
  const setEdges = useEdgesStore((state) => state.setEdges, shallow);

  const { open: openMenu } = useModal();
  const openSidebar = useSidebarState((state) => state.open);

  React.useEffect(() => {
    setZoom(state.zoom);
    setCoordinates(state.coordinates);

    setNodes(state.nodes, state.nodeTypes, state.portTypes);
    setEdges(state.edges);
  }, [
    setCoordinates,
    setEdges,
    setNodes,
    setZoom,
    state.coordinates,
    state.edges,
    state.nodeTypes,
    state.nodes,
    state.portTypes,
    state.zoom,
  ]);

  //----------------------------------------------------------------

  const menu = document.getElementById("breakout");

  return (
    <div
      className="w-full h-full grid"
      style={{
        gridTemplateColumns: "max-content 1fr max-content",
        gridAutoRows: "none",
      }}
    >
      <NewNodeToolbar style={{ gridColumn: "1", gridRow: "1" }} />
      {openSidebar && (
        <NodeEditingSidebar
          className="bg-gray-300"
          style={{ gridColumn: "3", gridRow: "1", zIndex: "1" }}
        />
      )}
      <Stage
        disablePan={disablePan}
        disableZoom={disableZoom}
        style={{ gridColumn: "2 / 4", gridRow: "1" }}
      >
        <ConnectionsWrapper />
        <Nodes />
      </Stage>
      {openMenu && (
        <Portal node={menu}>
          <NewNodeMenu />
        </Portal>
      )}
    </div>
  );
};
