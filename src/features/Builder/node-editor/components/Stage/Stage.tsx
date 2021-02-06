import React from "react";
import { STAGE_ID } from "../../utilities";
import { clamp } from "lodash";
import { useKeyPressEvent } from "react-use";
import { useGesture } from "react-use-gesture";
import { useEditorStore } from "../../globalState/stores";
import clsx from "clsx";

type StageProps = {
  /**
   * Setting this to false disables panning in the Editor.
   */
  disablePan: boolean;
  /**
   * Setting this to false disables zooming in the Editor.
   */
  disableZoom: boolean;
  // className?: string;
};

type Stage = React.FC<React.HTMLAttributes<HTMLDivElement> & StageProps>;

/**
 * The Stage is the main parent component of the node-editor. It holds all the Nodes and Connections. It is pannable and zoomable.
 */
export const Stage: Stage = ({
  children,
  disablePan,
  disableZoom,
  className,
  ...props
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
  const [zoom, setZoom] = React.useState(initialZoom);
  const [coordinates, setCoordinates] = React.useState(initialCoordinates);

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

  return (
    <div
      id={`${STAGE_ID}${id}`}
      className={clsx(
        "overflow-hidden relative pattern-background outline-none",
        className
      )}
      tabIndex={-1}
      style={{ cursor: spaceIsPressed ? "grab" : "" }}
      {...stageGestures()}
      {...props}
    >
      {/* This inner wrapper is used to translate the position of the content on pan. */}
      <div
        className="origin-center absolute left-1/2 top-1/2"
        style={{
          transform: `translate(${coordinates[0]}px, ${coordinates[1]}px)`,
        }}
      >
        {/* This inner wrapper is used to zoom.  */}
        <div className="absolute" style={{ transform: `scale(${zoom})` }}>
          {children}
        </div>
      </div>
    </div>
  );
};
