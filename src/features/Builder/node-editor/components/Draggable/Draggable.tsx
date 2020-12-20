import { coordinates } from "../../types";
import { EditorContext } from "../../utilities";
import React from "react";

//onDrag is a prop of an HTML div element, to avoid the type collision it is ommited here
type DivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragEnd" | "onDragStart"
>;

type DraggableProps = DivProps & {
  stageRect?: React.MutableRefObject<DOMRect | null>;
  onDragDelayStart?: (
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onDragStart?: (e: MouseEvent) => void;
  onDrag?: (coordinates: coordinates, e: MouseEvent) => void;
  onDragEnd?: (coordinates: coordinates, e: MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  delay?: number;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export const Draggable: React.FC<DraggableProps> = ({
  children,
  stageRect,
  onDragDelayStart,
  onDragStart,
  onDrag,
  onDragEnd,
  onMouseDown,
  onTouchStart,
  disabled,
  delay = 6,
  innerRef,
  ...props
}) => {
  const [editorState] = React.useContext(EditorContext);
  const startCoordinates = React.useRef({ x: 0, y: 0 });
  const offset = React.useRef({ x: 0, y: 0 });
  const wrapper = React.useRef<HTMLDivElement | null>(null);

  const byScale = (value: number) => (1 / editorState.zoom) * value;

  const getScaledCoordinates = (e: MouseEvent) => {
    const x =
      byScale(
        e.clientX -
          (stageRect?.current?.left ?? 0) -
          offset.current.x -
          (stageRect?.current?.width ?? 0) / 2
      ) + byScale(editorState.position.x);
    const y =
      byScale(
        e.clientY -
          (stageRect?.current?.top ?? 0) -
          offset.current.y -
          (stageRect?.current?.height ?? 0) / 2
      ) + byScale(editorState.position.y);
    return { x, y };
  };

  const updateCoordinates = (e: MouseEvent) => {
    const coordinates = getScaledCoordinates(e);
    if (onDrag) {
      onDrag(coordinates, e);
    }
  };

  const stopDrag = (e: MouseEvent) => {
    const coordinates = getScaledCoordinates(e);
    if (onDragEnd) {
      onDragEnd(coordinates, e);
    }
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("mousemove", updateCoordinates);
  };

  const startDrag = (e: MouseEvent) => {
    if (onDragStart) {
      onDragStart(e);
    }
    const nodeRect = wrapper?.current?.getBoundingClientRect();
    if (!nodeRect) return;

    offset.current = {
      x: startCoordinates.current.x - nodeRect.left,
      y: startCoordinates.current.y - nodeRect.top,
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", updateCoordinates);
  };

  const checkDragDelay = (e: MouseEvent) => {
    e.preventDefault();

    const a = Math.abs(startCoordinates.current.x - e.clientX);
    const b = Math.abs(startCoordinates.current.y - e.clientY);
    const distance = Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
    const dragDistance = delay;

    if (distance >= dragDistance) {
      startDrag(e);
      endDragDelay();
    }
  };

  const endDragDelay = () => {
    document.removeEventListener("mouseup", endDragDelay);
    document.removeEventListener("mousemove", checkDragDelay);
    startCoordinates.current = { x: 0, y: 0 };
  };

  const startDragDelay = (
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (onDragDelayStart) {
      onDragDelayStart(e);
    }

    e.stopPropagation();

    let x;
    let y;

    if (e.nativeEvent instanceof TouchEvent) {
      x = e.nativeEvent.touches[0].clientX;
      y = e.nativeEvent.touches[0].clientY;
    } else {
      e.preventDefault();
      x = e.nativeEvent.clientX;
      y = e.nativeEvent.clientY;
    }

    startCoordinates.current = { x, y };
    document.addEventListener("mouseup", endDragDelay);
    document.addEventListener("mousemove", checkDragDelay);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={(e) => {
        if (!disabled) {
          startDragDelay(e);
        }
        if (onMouseDown) {
          onMouseDown(e);
        }
      }}
      onTouchStart={(e) => {
        if (!disabled) {
          startDragDelay(e);
        }
        if (onTouchStart) {
          onTouchStart(e);
        }
      }}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      ref={(ref) => {
        wrapper.current = ref;
        if (innerRef) {
          innerRef.current = ref;
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};
