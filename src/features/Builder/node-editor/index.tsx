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

// Types, Constants and Styles
import styles from "./index.module.css";
import {
  EditorContext,
  createConnections,
  DRAG_CONNECTION_ID,
} from "./utilities";

//Hooks and Functions
import { useDOMRect } from "./hooks/useDOMRect";
import { useFunctionAfterLayout } from "./hooks/useFunctionAfterLayout";

type NodeEditorProps = {
  /**
   * The state of the content in the Editor.
   */
  state: EditorState;
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
  // hideComments = false,
  circularBehavior = "prevent",
  disableZoom = false,
  disablePan = false,
}) => {
  //Toasts are used as Notifications to the User informing him of Errors and other Messages.
  //TODO Toasts should be part of the main Application not just the node-editor
  const [toasts, dispatchToasts] = React.useReducer(toastsReducer, []);

  //The editorState contains all the information the editor needs to render.
  const [editorState, dispatchEditorState] = React.useReducer<
    React.Reducer<EditorState, editorActions>
  >(editorReducer(circularBehavior, dispatchToasts), {
    ...state,
  });

  //----------------------------------------------------------------

  //This DOMRect references the Stage of the node-editor. It is then used across the Editor to calculate positions and connections.
  const [stageRef, recalculateRect] = useDOMRect(editorState.id);

  //----------------------------------------------------------------

  //The following hook returns a function that triggers the function supplied to the hook after this component has been rendered.
  const triggerRecalculateConnections = useFunctionAfterLayout(() =>
    createConnections(editorState)
  );

  //----------------------------------------------------------------

  return (
    //The EditorState and dispatcher are shard across the node-editor.
    <EditorContext.Provider value={[editorState, dispatchEditorState]}>
      <Stage
        disablePan={disablePan}
        disableZoom={disableZoom}
        stageRect={stageRef}
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
            key={node.id}
            recalculate={triggerRecalculateConnections}
          />
        ))}

        <Connections editorId={editorState.id} />

        <div
          className={styles.dragWrapper}
          id={`${DRAG_CONNECTION_ID}${editorState.id}`}
        />
      </Stage>
    </EditorContext.Provider>
  );
};
