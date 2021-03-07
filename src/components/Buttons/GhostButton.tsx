import React from "react";
import clsx from "clsx";
import {
  buttonBase,
  CommonButtonProps,
  buttonSizes as baseButtonSizes,
} from "./shared";

const buttonSizes = { ...baseButtonSizes, fillContainer: "p-0" };

export type GhostButtonProps = CommonButtonProps & {
  /**
   * What size should the Button be?
   */
  size?: keyof typeof buttonSizes;
  /**
   * Toggle rounded corners.
   */
  rounded?: boolean;
};

/**
 * Button without styling. Useful for situation where a totally custom Button is needed.
 */
export const GhostButton: React.FC<GhostButtonProps> = ({
  className = "",
  children,
  size = "fillContainer",
  rounded = true,
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      buttonBase,
      buttonSizes[size],
      rounded && "rounded",
      active && ""
    )}
    {...props}
  >
    {children}
  </button>
);
