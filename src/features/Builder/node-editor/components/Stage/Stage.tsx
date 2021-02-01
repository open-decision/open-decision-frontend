import React from "react";
import styles from "./Stage.module.css";
import { STAGE_ID } from "../../utilities";
import { clamp } from "lodash";
import { useKeyPressEvent } from "react-use";
import { useGesture } from "react-use-gesture";
import { useEditorStore } from "../../globalState/stores";

type StageProps = {
  /**
   * Setting this to false disables panning in the Editor.
   */
  disablePan: boolean;
  /**
   * Setting this to false disables zooming in the Editor.
   */
  disableZoom: boolean;
};

/**
 * The Stage is the main parent component of the node-editor. It holds all the Nodes and Connections. It is pannable and zoomable.
 */
export const Stage: React.FC<StageProps> = ({
  children,
  disablePan,
  disableZoom,
}) => {
  const [
    initialZoom,
    initialCoordinates,
    id,
    setEditorConfig,
  ] = useEditorStore((state) => [
    state.editorConfig.zoom,
    state.editorConfig.coordinates,
    state.editorConfig.id,
    state.setEditorConfig,
  ]);

  // const nodeTypes = useNodesStore((state) => state.nodeTypes);
  // const addNode = useNodesStore((state) => state.addNode);

  const [zoom, setZoom] = React.useState(initialZoom);
  const [coordinates, setCoordinates] = React.useState(initialCoordinates);

  /**
   * The wrapper is used as a ref for the main Box of the Stage. This allows the Stage to be imperatively modified without causing a rerender.
   */
  const ref = React.useRef<HTMLDivElement>(null);
  // const mousePosition = React.useRef<coordinates>([0, 0]);

  /**
   * This tracks whether the space key is pressed. We need this, because the Stage should be pannable when pressing the space key.
   */
  const [spaceIsPressed, setSpaceIsPressed] = React.useState(false);
  useKeyPressEvent(
    (e) => e.code === "Space",
    () => setSpaceIsPressed(true),
    () => {
      setEditorConfig({ coordinates });
      setSpaceIsPressed(false);
    }
  );

  /**
   * These gestures represent the panning and zooming inside the Stage. They are enabled and disabled by the `disableZoom` and `disablePan` props.
   */
  const stageGestures = useGesture(
    {
      // We track the mousewheel and zoom in and out of the Stage. We only update the global state at the end of the wheel gesture.
      onWheel: ({ delta: [, y] }) =>
        setZoom(clamp(zoom - clamp(y, -10, 10) * 0.005, 0.5, 2)),
      onWheelEnd: () => setEditorConfig({ zoom }),

      // We track the drag and pan the Stage based on the previous coordinates and the delta (change) in the coordinates. We only update the global state at the end of the drag gesture.
      onDrag: ({ movement }) => setCoordinates(movement),
      onDragEnd: () => setEditorConfig({ coordinates }),
      //This gesture enables panning of the Stage when the mouse is moved. We need this to make the Stage pannable when the Space key is pressed. Because we have to update the global state before we set disable the move we set it in the useKeypreeEvent Hook.
      onMove: ({ movement }) => setCoordinates(movement),
      onMoveEnd: () => setEditorConfig({ coordinates }),
    },
    {
      move: { enabled: !disablePan && spaceIsPressed, initial: coordinates },
      wheel: { enabled: !disableZoom, axis: "y" },
      drag: { enabled: !disablePan, initial: coordinates },
    }
  );

  //------------------------------------------------------------------------

  const setRuntimeData = useEditorStore((state) => state.setRuntimeData);

  React.useEffect(() => {
    const runtimeData = ref.current?.getBoundingClientRect();

    runtimeData && setRuntimeData(runtimeData);
  }, [setRuntimeData]);

  //------------------------------------------------------------------------
  // /**
  //  * Can be called to add a new Comment.
  //  */
  // const addComment = () => {
  //   coordinates
  //     ? dispatch({
  //         type: "ADD_COMMENT",
  //         coordinates,
  //       })
  //     : null;
  // };

  // /**
  //  * Handles the different kinds of elements that can be added to the Editor.
  //  */
  // const addElement = (menuOption: menuOption) => {
  //   switch (menuOption.internalType) {
  //     case "comment":
  //       // addComment();
  //       break;

  //     case "node":
  //       addNode(menuOption.type);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // /**
  //  * The menuOptions are filling the ContextMenu with the nodes that are addable to the Editor. They are sorted based on sortIndex and label.
  //  */
  // const menuOptions = React.useMemo(() => {
  //   const options = orderBy(
  //     Object.values(nodeTypes).map(
  //       (nodeType): menuOption => ({
  //         type: nodeType.type,
  //         label: nodeType.label,
  //         description: nodeType.description,
  //         sortPriority: nodeType.sortPriority,
  //         internalType: "node",
  //       })
  //     ),
  //     ["sortIndex", "label"]
  //   );

  //   return options;
  // }, [nodeTypes]);

  return (
    // A Draggable component is providing the main Stage Container.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id={`${STAGE_ID}${id}`}
      className={styles.wrapper}
      // onContextMenu={handleContextMenu}
      tabIndex={-1}
      // style={{ cursor: spaceIsPressed ? "grab" : "" }}
      ref={ref}
      {...stageGestures()}
    >
      {/* Here we track whether the ContextMenu should be open or closed. When we
      open the menu the coordinates are set based on the position of the mouse
      click.
      {menuOpen && (
        <ContextMenu
          coordinates={menuCoordinates}
          options={menuOptions}
          onOptionSelected={addElement}
          label="Add Node"
        />
      )} */}
      {/* This inner wrapper is used to translate the position of the content on pan. */}
      <div
        className={styles.transformWrapper}
        style={{
          transform: `translate(${coordinates[0]}px, ${coordinates[1]}px)`,
        }}
      >
        {/* This inner wrapper is used to zoom.  */}
        <div
          className={styles.scaleWrapper}
          style={{ transform: `scale(${zoom})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
