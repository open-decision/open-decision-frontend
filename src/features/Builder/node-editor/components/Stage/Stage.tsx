import React from "react";
import styles from "./Stage.module.css";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import {
  EditorDispatchContext,
  EditorContext,
  STAGE_ID,
} from "../../utilities";
import { Draggable } from "../Draggable/Draggable";
import orderBy from "lodash/orderBy";
import clamp from "lodash/clamp";
import { coordinates } from "../../types";

type StageProps = {
  outerStageChildren: React.ReactNode;
  numNodes: number;
  stageRect: React.MutableRefObject<DOMRect | null>;
  spaceToPan: boolean;
  disablePan: boolean;
  disableZoom: boolean;
};

export const Stage: React.FC<StageProps> = ({
  children,
  outerStageChildren,
  numNodes,
  stageRect,
  spaceToPan,
  disablePan,
  disableZoom,
}) => {
  const dispatch = React.useContext(EditorDispatchContext);
  const {
    zoom,
    position,
    id,
    config: [nodeTypes],
  } = React.useContext(EditorContext);

  const wrapper = React.useRef<HTMLDivElement>(null);
  const translateWrapper = React.useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState<coordinates>({
    x: 0,
    y: 0,
  });

  const dragData = React.useRef({ x: 0, y: 0 });
  const [spaceIsPressed, setSpaceIsPressed] = React.useState(false);

  const setStageRect = React.useCallback(() => {
    stageRect.current = wrapper?.current?.getBoundingClientRect() ?? null;
  }, [stageRect.current]);

  React.useEffect(() => {
    stageRect.current = wrapper?.current?.getBoundingClientRect() ?? null;
    window.addEventListener("resize", setStageRect);
    return () => {
      window.removeEventListener("resize", setStageRect);
    };
  }, [stageRect.current, setStageRect]);

  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (numNodes > 0) {
        dispatch({
          type: "SET_SCALE",
          zoom: clamp(zoom - clamp(e.deltaY, -10, 10) * 0.005, 0.1, 7),
        });
      }
    },
    [dispatch, numNodes, zoom]
  );

  const handleDragDelayStart = () => {
    wrapper?.current?.focus();
  };

  const handleDragStart = (e: MouseEvent) => {
    e.preventDefault();
    dragData.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseDrag = (_coordinates: coordinates, e: MouseEvent) => {
    const xDistance = dragData.current.x - e.clientX;
    const yDistance = dragData.current.y - e.clientY;
    translateWrapper?.current
      ? (translateWrapper.current.style.transform = `translate(${-(
          position.x + xDistance
        )}px, ${-(position.y + yDistance)}px)`)
      : null;
  };

  const handleDragEnd = (_coordinates: coordinates, e: MouseEvent) => {
    const xDistance = dragData.current.x - e.clientX;
    const yDistance = dragData.current.y - e.clientY;
    dragData.current.x = e.clientX;
    dragData.current.y = e.clientY;
    dispatch({
      type: "SET_TRANSLATE",
      position: {
        x: position.x + xDistance,
        y: position.y + yDistance,
      },
    });
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  const byScale = (value: number) => (1 / zoom) * value;

  const addNode = (option: menuOption) => {
    const wrapperRect = wrapper?.current?.getBoundingClientRect();

    if (wrapperRect) {
      const x =
        byScale(menuCoordinates.x - wrapperRect.x - wrapperRect.width / 2) +
        byScale(position.x);

      const y =
        byScale(menuCoordinates.y - wrapperRect.y - wrapperRect.height / 2) +
        byScale(position.y);

      if (option.internalType === "comment") {
        dispatch({
          type: "ADD_COMMENT",
          x,
          y,
        });
      } else if (option.internalType === "node") {
        dispatch({
          type: "ADD_NODE",
          x,
          y,
          nodeType: option.value,
        });
      }
    }
  };

  const handleDocumentKeyUp = (e: KeyboardEvent) => {
    if (e.which === 32) {
      setSpaceIsPressed(false);
      document.removeEventListener("keyup", handleDocumentKeyUp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.which === 32 && document.activeElement === wrapper.current) {
      e.preventDefault();
      e.stopPropagation();
      setSpaceIsPressed(true);
      document.addEventListener("keyup", handleDocumentKeyUp);
    }
  };

  const handleMouseEnter = () => {
    if (!wrapper?.current?.contains(document.activeElement)) {
      wrapper?.current?.focus();
    }
  };

  React.useEffect(() => {
    if (!disableZoom) {
      const stageWrapper = wrapper.current;
      stageWrapper?.addEventListener("wheel", handleWheel);
      return () => {
        stageWrapper?.removeEventListener("wheel", handleWheel);
      };
    } else return;
  }, [handleWheel, disableZoom]);

  const menuOptions = React.useMemo(() => {
    const options = orderBy(
      Object.values(nodeTypes).map(
        (node): menuOption => ({
          value: node.type,
          label: node.label,
          description: node.description,
          sortPriority: node.sortPriority,
        })
      ),
      ["sortIndex", "label"]
    );

    return options;
  }, [nodeTypes]);

  return (
    <Draggable
      id={`${STAGE_ID}${id}`}
      className={styles.wrapper}
      innerRef={wrapper}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onDragDelayStart={handleDragDelayStart}
      onDragStart={handleDragStart}
      onDrag={handleMouseDrag}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ cursor: spaceIsPressed && spaceToPan ? "grab" : "" }}
      disabled={disablePan || (spaceToPan && !spaceIsPressed)}
    >
      {menuOpen ? (
        <Portal>
          <ContextMenu
            x={menuCoordinates.x}
            y={menuCoordinates.y}
            options={menuOptions}
            onRequestClose={() => setMenuOpen(false)}
            onOptionSelected={addNode}
            label="Add Node"
          />
        </Portal>
      ) : null}
      <div
        ref={translateWrapper}
        className={styles.transformWrapper}
        style={{ transform: `translate(${-position.x}px, ${-position.y}px)` }}
      >
        <div
          className={styles.scaleWrapper}
          style={{ transform: `scale(${zoom})` }}
        >
          {children}
        </div>
      </div>
      {outerStageChildren}
    </Draggable>
  );
};
