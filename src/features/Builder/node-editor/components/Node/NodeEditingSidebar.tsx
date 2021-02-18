import clsx from "clsx";
import React from "react";
import { useKeyPressEvent } from "react-use";
import { useNodesStore } from "../../globalState";
import { useSidebarState } from "./useSidebar";

export const NodeEditingSidebar = ({ className, ...props }) => {
  const [closeSidebar, nodeType] = useSidebarState((state) => [
    state.closeSidebar,
    state.nodeType,
  ]);
  const config = useNodesStore((state) => state.nodeTypes[nodeType]);

  const ref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => closeSidebar());
  useKeyPressEvent("Escape", () => closeSidebar());

  return (
    <div className={clsx("w-96", className)} ref={ref} {...props}>
      Test
    </div>
  );
};

// Hook
function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  handler: (event: PointerEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: PointerEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!(event.target instanceof Node)) return;
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      event.stopPropagation();
      handler(event);
    };

    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, handler]);
}
