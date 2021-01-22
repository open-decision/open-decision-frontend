//External Libraries
import React from "react";

//State Management
import { toastsReducer } from "./globalState";

//Components
import { Stage } from "./components/Stage/Stage";
// import { Comment } from "./components/Comment/Comment";
// import { Toaster } from "./components/Toaster/Toaster";

//Hooks and Functions
import {
  useEdgesStore,
  useEditorStore,
  useNodesStore,
} from "./globalState/stores";
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
  config: [nodeTypes, portTypes];
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
  //#region
  //Toasts are used as Notifications to the User informing him of Errors and other Messages.
  //TODO Toasts should be part of the main Application not just the node-editor
  const [toasts, dispatchToasts] = React.useReducer(toastsReducer, []);
  //#endregion

  const setEditorConfig = useEditorStore((state) => state.setEditorConfig);
  const setNodes = useNodesStore((state) => state.setNodes);
  const setEdges = useEdgesStore((state) => state.setEdges);

  React.useEffect(() => {
    setEditorConfig({
      zoom: state.zoom,
      coordinates: state.coordinates,
      config: state.config,
    });
    setNodes(state.nodes);
    setEdges(state.edges);
  }, [
    setEdges,
    setEditorConfig,
    setNodes,
    state.config,
    state.coordinates,
    state.edges,
    state.nodes,
    state.zoom,
  ]);

  //----------------------------------------------------------------

  return (
    <Stage disablePan={disablePan} disableZoom={disableZoom}>
      <Nodes />
      <ConnectionsWrapper />
    </Stage>
  );
};
