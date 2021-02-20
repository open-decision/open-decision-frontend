import React from "react";
import { useKeyboardEvent } from "@utils/index";
import { Button } from "./Button";
import clsx from "clsx";

type Dropdown = {
  icon: React.ReactNode;
  className?: string;
};

export const Dropdown: React.FunctionComponent<Dropdown> = ({
  children,
  icon,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  useKeyboardEvent("Escape", () => setOpen(false));

  return (
    <div className={clsx("relative h-10", className)}>
      <Button
        className="relative z-20"
        size="filled"
        kind="icon"
        onClick={() => setOpen(!open)}
      >
        {icon}
      </Button>
      {open ? (
        <>
          <button
            onClick={() => setOpen(false)}
            className="z-10 fixed inset-0 w-full h-full bg-gray-900 opacity-25 cursor-default"
            tabIndex={-1}
          />
          <div className="absolute right-0 mt-6 shadow-lg">
            <div className="relative z-20 px-8 py-6 rounded-sm bg-gray-100">
              {children}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
