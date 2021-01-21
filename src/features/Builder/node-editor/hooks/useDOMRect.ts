import { STAGE_ID } from "../utilities";
import React from "react";

export const useDOMRect = (
  id: string
): [React.MutableRefObject<DOMRect | null>, () => void] => {
  /**
   * The persisted rectangle.
   */
  const ref = React.useRef<DOMRect | null>(null);

  /**
   * Is used to imperatively trigger a recalculation of the rectangle.
   */

  const recalculate = React.useCallback(() => {
    ref.current =
      document?.getElementById(`${STAGE_ID}${id}`)?.getBoundingClientRect() ??
      null;
  }, [id]);

  React.useLayoutEffect(() => recalculate(), [recalculate]);

  return [ref, recalculate];
};
