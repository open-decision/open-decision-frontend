import React from "react";
import styles from "./Stage.module.css";
import { Portal } from "react-portal";
import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
import { NodeDispatchContext } from "../../context";
import { Draggable } from "../Draggable/Draggable";
import orderBy from "lodash/orderBy";
import clamp from "lodash/clamp";
import { STAGE_ID } from "../../constants";
import { coordinates, Node, NodeConfig, NodeTypes } from "@globalTypes/types";

type StageProps = {
  scale: number;
  translate: coordinates;
  editorId: string;
  dispatchStageState: any;
  outerStageChildren: React.ReactNode;
  dispatchComments: any;
  numNodes: number;
  stageRef: React.MutableRefObject<DOMRect>;
  spaceToPan: boolean;
  disableComments: boolean;
  disablePan: boolean;
  disableZoom: boolean;
  nodeTypes: NodeTypes;
};

export const Stage: React.FC<StageProps> = ({
  scale,
  translate,
  editorId,
  dispatchStageState,
  children,
  outerStageChildren,
  numNodes,
  stageRef,
  spaceToPan,
  dispatchComments,
  disableComments,
  disablePan,
  disableZoom,
  nodeTypes,
}) => {
  const dispatchNodes = React.useContext(NodeDispatchContext);
  const wrapper = React.useRef<HTMLDivElement>();
  const translateWrapper = React.useRef<HTMLDivElement>();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });
  const dragData = React.useRef({ x: 0, y: 0 });
  const [spaceIsPressed, setSpaceIsPressed] = React.useState(false);

  const setStageRect = React.useCallback(() => {
    stageRef.current = wrapper.current.getBoundingClientRect();
  }, [stageRef]);

  React.useEffect(() => {
    stageRef.current = wrapper.current.getBoundingClientRect();
    window.addEventListener("resize", setStageRect);
    return () => {
      window.removeEventListener("resize", setStageRect);
    };
  }, [stageRef, setStageRect]);

  const handleWheel = React.useCallback(
    (e) => {
      if (e.target.nodeName === "TEXTAREA" || e.target.dataset.comment) {
        if (e.target.clientHeight < e.target.scrollHeight) return;
      }
      e.preventDefault();
      if (numNodes > 0) {
        const delta = e.deltaY;
        dispatchStageState(({ scale }: { scale: number }) => ({
          type: "SET_SCALE",
          scale: clamp(scale - clamp(delta, -10, 10) * 0.005, 0.1, 7),
        }));
      }
    },
    [dispatchStageState, numNodes]
  );

  const handleDragDelayStart = () => {
    wrapper.current.focus();
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
    translateWrapper.current.style.transform = `translate(${-(
      translate.x + xDistance
    )}px, ${-(translate.y + yDistance)}px)`;
  };

  const handleDragEnd = (_coordinates: coordinates, e: MouseEvent) => {
    const xDistance = dragData.current.x - e.clientX;
    const yDistance = dragData.current.y - e.clientY;
    dragData.current.x = e.clientX;
    dragData.current.y = e.clientY;
    dispatchStageState(({ translate }: { translate: coordinates }) => ({
      type: "SET_TRANSLATE",
      translate: {
        x: translate.x + xDistance,
        y: translate.y + yDistance,
      },
    }));
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
    return false;
  };

  const closeContextMenu = () => {
    setMenuOpen(false);
  };

  const byScale = (value: number) => (1 / scale) * value;

  const addNode = (option: menuOption) => {
    const wrapperRect = wrapper.current.getBoundingClientRect();

    const x =
      byScale(menuCoordinates.x - wrapperRect.x - wrapperRect.width / 2) +
      byScale(translate.x);

    const y =
      byScale(menuCoordinates.y - wrapperRect.y - wrapperRect.height / 2) +
      byScale(translate.y);

    if (option.internalType === "comment") {
      dispatchComments({
        type: "ADD_COMMENT",
        x,
        y,
      });
    } else {
      dispatchNodes({
        type: "ADD_NODE",
        x,
        y,
        nodeType: option.node.type,
      });
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
    if (!wrapper.current.contains(document.activeElement)) {
      wrapper.current.focus();
    }
  };

  React.useEffect(() => {
    if (!disableZoom) {
      const stageWrapper = wrapper.current;
      stageWrapper.addEventListener("wheel", handleWheel);
      return () => {
        stageWrapper.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, disableZoom]);

  const menuOptions = React.useMemo(() => {
    const options = orderBy(
      Object.values(nodeTypes)
        .filter((node) => node.addable !== false)
        .map(
          (node): menuOption => ({
            value: node.type,
            label: node.label,
            description: node.description,
            sortIndex: node.sortIndex,
            node,
          })
        ),
      ["sortIndex", "label"]
    );
    if (!disableComments) {
      options.push({
        value: "comment",
        label: "Comment",
        description: "A comment for documenting nodes",
        internalType: "comment",
      });
    }
    return options;
  }, [nodeTypes, disableComments]);

  return (
    <Draggable
      id={`${STAGE_ID}${editorId}`}
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
            onRequestClose={closeContextMenu}
            onOptionSelected={addNode}
            label="Add Node"
          />
        </Portal>
      ) : null}
      <div
        ref={translateWrapper}
        className={styles.transformWrapper}
        style={{ transform: `translate(${-translate.x}px, ${-translate.y}px)` }}
      >
        <div
          className={styles.scaleWrapper}
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      {outerStageChildren}
    </Draggable>
  );
};
