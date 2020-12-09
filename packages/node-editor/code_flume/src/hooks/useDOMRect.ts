import { STAGE_ID } from "@utilities/index";
import React from "react";

type useDomRect = [DOMRect, () => DOMRect];

export const useDOMRect = (id: string): useDomRect => {
  /**
   * The persisted rectangle.
   */
  const rect = React.useRef<DOMRect>();

  /**
   * Is used to imperatively trigger a recalculation of the rectangle.
   */
  const recalculate = () =>
    (rect.current = document
      .getElementById(`${STAGE_ID}${id}`)
      .getBoundingClientRect());

  return [rect.current, recalculate];
};
