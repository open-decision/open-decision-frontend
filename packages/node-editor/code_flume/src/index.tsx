//External Libraries
import React from "react";
import { useId } from "@reach/auto-id";
import clamp from "lodash/clamp";

//State Management
import { NodeDispatchContext, CacheContext, EditorContext } from "./context";
import {
  commentsReducer,
  toastsReducer,
  editorReducer,
  getInitialNodes,
  nodesReducer,
} from "./reducers";
import { cache } from "./cache";

//Components
import { Stage } from "./components/Stage/Stage";
import { Node } from "./components/Node/Node";
import { Comment } from "./components/Comment/Comment";
import { Toaster } from "./components/Toaster/Toaster";
import { Connections } from "./components/Connections/Connections";

//Functions
import { createConnections } from "./connectionCalculator";
import usePrevious from "./hooks/usePrevious";

// Types, Constants and Styles
import { STAGE_ID, DRAG_CONNECTION_ID } from "./constants";
import styles from "./index.module.css";
import {
  comments,
  defaultNode,
  nodes,
  NodeTypes,
  PortTypes,
} from "@globalTypes/types";

type NodeEditorProps = {
  /**
   * The state of the comments in the Editor.
   */
  comments: comments;
  /**
   * The state of the nodes in the Editor.
   */
  nodes: nodes;
  /**
   * The preconfigured node types. This determines which nodes are avaliable when working with the Editor.
   */
  nodeTypes: NodeTypes;
  /**
   * The preconfigured port types. This determines which ports are avaliable when working with the Editor.
   */
  portTypes: PortTypes;
  /**
   * To always start the Editor off with a set of nodes provide them as defaultNodes.
   */
  defaultNodes: defaultNode[];
  /**
   * @deprecated - The Editor should not be dependent on context. This is reserved for the Interpreter.
   */
  context: Record<string, unknown>;
  /**
   * @description - This function is called every time the nodes update. This is helpful when managing the editor state externally.
   * @param nodes - The nodes are provided as a parameter.
   */
  onNodesChange: (nodes: nodes) => void;
  /**
   * @description - This function is called every time the nodes update. This is helpful when managing the editor state externally.
   * @param comments - The nodes are provided as a parameter.
   */
  onCommentsChange: (comments: comments) => void;
  /**
   * Provide an optional initialZoom. By default the zoom is 1.
   */
  initialZoom?: number;
  /**
   * Similar to Photoshop it is possible to pan the Editor when holding the space key.
   */
  spaceToPan?: boolean;
  hideComments?: boolean;
  disableComments?: boolean;
  disableZoom?: boolean;
  disablePan?: boolean;
  /**
   * The Editor can make sure, that circular connections between nodes are not possible. By default circular connections are prevented.
   */
  circularBehavior?: "prevent" | "warn" | "allow";
  debug?: boolean;
};

export const NodeEditor: React.FC<NodeEditorProps> = ({
  comments: initialComments,
  nodes: initialNodes,
  nodeTypes = {},
  portTypes = {},
  defaultNodes = [],
  context = {},
  onNodesChange,
  onCommentsChange,
  initialZoom = 1,
  spaceToPan = false,
  hideComments = false,
  disableComments = false,
  disableZoom = false,
  disablePan = false,
  circularBehavior = "prevent",
  debug = false,
}) => {
  const editorId = useId();
  const cacheRef = React.useRef(cache);
  const stage = React.useRef<DOMRect>();

  const [sideEffectToasts, setSideEffectToasts] = React.useState();
  const [toasts, dispatchToasts] = React.useReducer(toastsReducer, []);

  const [nodes, dispatchNodes] = React.useReducer(
    nodesReducer(
      { nodeTypes, portTypes, cache, circularBehavior, context },
      setSideEffectToasts
    ),
    {},
    () =>
      getInitialNodes(initialNodes, defaultNodes, nodeTypes, portTypes, context)
  );

  const [comments, dispatchComments] = React.useReducer(
    commentsReducer,
    initialComments || {}
  );

  React.useEffect(() => {
    dispatchNodes({ type: "HYDRATE_DEFAULT_NODES" });
  }, []);

  const [
    shouldRecalculateConnections,
    setShouldRecalculateConnections,
  ] = React.useState(true);

  const [editorState, dispatchEditorState] = React.useReducer(editorReducer, {
    id: editorId,
    scale: clamp(initialZoom, 0.1, 7),
    translate: { x: 0, y: 0 },
    executionContext: context,
  });

  const recalculateConnections = React.useCallback(() => {
    createConnections(nodes, editorState, editorId);
  }, [nodes, editorId, editorState]);

  const recalculateStageRect = () => {
    stage.current = document
      .getElementById(`${STAGE_ID}${editorId}`)
      .getBoundingClientRect();
  };

  React.useLayoutEffect(() => {
    if (shouldRecalculateConnections) {
      recalculateConnections();
      setShouldRecalculateConnections(false);
    }
  }, [shouldRecalculateConnections, recalculateConnections]);

  const triggerRecalculation = () => {
    setShouldRecalculateConnections(true);
  };

  const previousNodes = usePrevious(nodes);

  React.useEffect(() => {
    if (previousNodes && onNodesChange && nodes !== previousNodes) {
      onNodesChange(nodes);
    }
  }, [nodes, previousNodes, onNodesChange]);

  const previousComments = usePrevious(comments);

  React.useEffect(() => {
    if (previousComments && onCommentsChange && comments !== previousComments) {
      onCommentsChange(comments);
    }
  }, [comments, previousComments, onCommentsChange]);

  React.useEffect(() => {
    if (sideEffectToasts) {
      dispatchToasts(sideEffectToasts);
      setSideEffectToasts(null);
    }
  }, [sideEffectToasts]);

  return (
    <NodeDispatchContext.Provider value={dispatchNodes}>
      <CacheContext.Provider value={cacheRef}>
        <EditorContext.Provider value={editorState}>
          <Stage
            editorId={editorId}
            scale={editorState.scale}
            translate={editorState.translate}
            spaceToPan={spaceToPan}
            disablePan={disablePan}
            disableZoom={disableZoom}
            dispatchStageState={dispatchEditorState}
            dispatchComments={dispatchComments}
            disableComments={disableComments || hideComments}
            stageRef={stage}
            numNodes={Object.keys(nodes).length}
            nodeTypes={nodeTypes}
            outerStageChildren={
              <React.Fragment>
                {debug && (
                  <div className={styles.debugWrapper}>
                    <button onClick={() => console.log(nodes)}>
                      Log Nodes
                    </button>
                    <button onClick={() => console.log(JSON.stringify(nodes))}>
                      Export Nodes
                    </button>
                    <button onClick={() => console.log(comments)}>
                      Log Comments
                    </button>
                  </div>
                )}
                <Toaster toasts={toasts} dispatchToasts={dispatchToasts} />
              </React.Fragment>
            }
          >
            {!hideComments &&
              Object.values(comments).map((comment) => (
                <Comment
                  {...comment}
                  stageRect={stage}
                  dispatch={dispatchComments}
                  onDragStart={recalculateStageRect}
                  key={comment.id}
                />
              ))}
            {Object.values(nodes).map((node) => (
              <Node
                {...node}
                stageRect={stage}
                onDragEnd={triggerRecalculation}
                onDragStart={recalculateStageRect}
                key={node.id}
                nodeTypes={nodeTypes}
                portTypes={portTypes}
                recalculate={triggerRecalculation}
              />
            ))}
            <Connections editorId={editorId} />
            <div
              className={styles.dragWrapper}
              id={`${DRAG_CONNECTION_ID}${editorId}`}
            ></div>
          </Stage>
        </EditorContext.Provider>
      </CacheContext.Provider>
    </NodeDispatchContext.Provider>
  );
};

export { comments, nodes };
