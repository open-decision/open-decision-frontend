//External Libraries
import React from "react";

//State Management
import {
  toastsReducer,
  editorReducer,
  EditorState,
  editorActions,
} from "./reducers";

//Components
import { Stage } from "./components/Stage/Stage";
import { Node } from "./components/Node/Node";
// import { Comment } from "./components/Comment/Comment";
import { Toaster } from "./components/Toaster/Toaster";
import { Connections } from "./components/Connections/Connections";

//Functions
import usePrevious from "./hooks/usePrevious";

// Types, Constants and Styles
import styles from "./index.module.css";
import {
  EditorDispatchContext,
  EditorContext,
  createConnections,
  DRAG_CONNECTION_ID,
} from "./utilities";
import { useDOMRect } from "./hooks/useDOMRect";

type NodeEditorProps = {
  /**
   * The state of the content in the Editor.
   */
  state: EditorState;
  /**
   * @description - This function is called every time the nodes update. This is helpful when managing the editors state externally.
   * @param state - The state of the Editor.
   */
  onChange: (state: EditorState) => void;
  /**
   * Similar to Photoshop it is possible to pan the Editor when holding the space key. False by default.
   */
  spaceToPan?: boolean;
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
  onChange,
  hideComments = false,
  circularBehavior = "prevent",
  spaceToPan = false,
  disableZoom = false,
  disablePan = false,
}) => {
  //The following is used for state management
  const [toasts, dispatchToasts] = React.useReducer(toastsReducer, []);

  const [editorState, dispatchEditorState] = React.useReducer<
    React.Reducer<EditorState, editorActions>
  >(editorReducer(circularBehavior, dispatchToasts), {
    ...state,
  });

  //----------------------------------------------------------------

  //These Refs allow us to preserve state across component renders without causing a rerender.
  const [stageRef, recalculateRect] = useDOMRect(editorState.id);

  //----------------------------------------------------------------

  //These functions are used to update the stage imperatively across the codebase when necessary. They also track whether something should be recalculated.

  const [
    shouldRecalculateConnections,
    setShouldRecalculateConnections,
  ] = React.useState(true);

  const triggerRecalculation = () => {
    setShouldRecalculateConnections(true);
  };

  const recalculateConnections = React.useCallback(() => {
    createConnections(editorState, editorState.id);
  }, [editorState]);

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
          spaceToPan={spaceToPan}
          disablePan={disablePan}
          disableZoom={disableZoom}
          stageRect={stageRef}
          numNodes={Object.keys(editorState.nodes).length}
          outerStageChildren={
            <React.Fragment>
              <Toaster toasts={toasts} dispatchToasts={dispatchToasts} />
            </React.Fragment>
          }
        >
          {/* {!hideComments &&
            Object.values(editorState.comments).map((comment) => (
              <Comment
                {...comment}
                stageRect={stageRef}
                onDragStart={recalculateRect}
                key={comment.id}
              />
            ))} */}

          {Object.values(editorState.nodes).map((node) => (
            <Node
              node={node}
              stageRect={stageRef}
              onDragStart={recalculateRect}
              key={node.id}
              recalculate={triggerRecalculation}
            />
          ))}

          <Connections editorId={editorState.id} />

          <div
            className={styles.dragWrapper}
            id={`${DRAG_CONNECTION_ID}${editorState.id}`}
          />
        </Stage>
      </EditorContext.Provider>
    </EditorDispatchContext.Provider>
  );
};
