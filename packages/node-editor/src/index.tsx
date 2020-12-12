//External Libraries
import React from "react";
import clamp from "lodash/clamp";
import { nanoid } from "nanoid/non-secure";

//State Management
import { toastsReducer, editorReducer, EditorState } from "./reducers";

//Components
import { Stage } from "./components/Stage/Stage";
import { Node } from "./components/Node/Node";
import { Comment } from "./components/Comment/Comment";
import { Toaster } from "./components/Toaster/Toaster";
import { Connections } from "./components/Connections/Connections";

//Functions
import usePrevious from "./hooks/usePrevious";

// Types, Constants and Styles
import styles from "./index.module.css";
import { defaultNode, EditorConfig } from "@globalTypes/types";
import {
  EditorDispatchContext,
  EditorContext,
  createConnections,
  DRAG_CONNECTION_ID,
} from "@utilities/index";
import { useDOMRect } from "hooks/useDOMRect";

type NodeEditorProps = {
  /**
   * The state of the content in the Editor.
   */
  state: EditorState;
  /**
   * The preconfigured nodes and ports. This determines which nodes are avaliable when working with the Editor.
   */
  config: EditorConfig;
  /**
   * To always start the Editor off with a set of nodes provide them as defaultNodes.
   */
  defaultNodes?: defaultNode[];
  /**
   * @description - This function is called every time the nodes update. This is helpful when managing the editor state externally.
   * @param state - The state of the Editor.
   */
  onChange: (state: EditorState) => void;
  /**
   * Similar to Photoshop it is possible to pan the Editor when holding the space key.
   */
  spaceToPan?: boolean;
  disableComments?: boolean;
  disableZoom?: boolean;
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
   * Comments can be hidden dynamically.
   */
  hideComments?: boolean;
};

export const NodeEditor: React.FC<NodeEditorProps> = ({
  state,
  config,
  hideComments = false,
  zoom = 1,
  circularBehavior = "prevent",
  // defaultNodes = [],
  onChange,
  spaceToPan = false,
  disableComments = false,
  disableZoom = false,
  disablePan = false,
}) => {
  //These Refs allow us to preserve state across component renders without causing a rerender.
  const editorId = nanoid(10);
  const [stageRef, recalculateRect] = useDOMRect(editorId);

  //----------------------------------------------------------------

  //The following is used for state management
  const [toasts, dispatchToasts] = React.useReducer(toastsReducer, []);

  const [editorState, dispatchEditorState] = React.useReducer(
    editorReducer(config, circularBehavior, dispatchToasts),
    {
      id: editorId,
      zoom: clamp(zoom, 0.1, 7),
      position: { x: 0, y: 0 },
      nodes: state.nodes,
      comments: state.comments,
    }
  );

  //----------------------------------------------------------------

  //These functions are used to update the stage imperatively across the codebase when necessary. They also track whether something should be recalculated.
  React.useEffect(() => {
    dispatchEditorState({ type: "HYDRATE_DEFAULT_NODES" });
  }, []);

  const [
    shouldRecalculateConnections,
    setShouldRecalculateConnections,
  ] = React.useState(true);

  const triggerRecalculation = () => {
    setShouldRecalculateConnections(true);
  };

  const recalculateConnections = React.useCallback(() => {
    createConnections(editorState, editorId);
  }, [editorId, editorState]);

  React.useLayoutEffect(() => {
    if (shouldRecalculateConnections) {
      recalculateConnections();
      setShouldRecalculateConnections(false);
    }
  }, [shouldRecalculateConnections, recalculateConnections]);

  const previousNodes = usePrevious(editorState);
  React.useEffect(() => {
    if (previousNodes && onChange && editorState !== previousNodes) {
      onChange(editorState);
    }
  }, [editorState, previousNodes, onChange]);

  //----------------------------------------------------------------

  return (
    <EditorDispatchContext.Provider value={dispatchEditorState}>
      <EditorContext.Provider value={editorState}>
        <Stage
          nodeTypes={config.nodes}
          spaceToPan={spaceToPan}
          disablePan={disablePan}
          disableZoom={disableZoom}
          disableComments={disableComments || hideComments}
          stageRect={stageRef}
          numNodes={Object.keys(editorState.nodes).length}
          outerStageChildren={
            <React.Fragment>
              <Toaster toasts={toasts} dispatchToasts={dispatchToasts} />
            </React.Fragment>
          }
        >
          {!hideComments &&
            Object.values(editorState.comments).map((comment) => (
              <Comment
                {...comment}
                stageRect={stageRef}
                onDragStart={recalculateRect}
                key={comment.id}
              />
            ))}
          {Object.values(editorState.nodes).map((node) => (
            <Node
              {...node}
              stageRect={stageRef}
              onDragEnd={triggerRecalculation}
              onDragStart={recalculateRect}
              key={node.id}
              recalculate={triggerRecalculation}
              nodeTypes={config.nodes}
              portTypes={config.ports}
            />
          ))}
          <Connections editorId={editorId} />
          <div
            className={styles.dragWrapper}
            id={`${DRAG_CONNECTION_ID}${editorId}`}
          ></div>
        </Stage>
      </EditorContext.Provider>
    </EditorDispatchContext.Provider>
  );
};

export { EditorState };
