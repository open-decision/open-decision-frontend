import React from "react";
import clsx from "clsx";
import {
  defaultButtonBase,
  CommonButtonProps,
  buttonSizes,
  buttonVariants,
} from "./shared";

const variants = {
  ...buttonVariants,
  primary:
    "bg-primary-300 hover:bg-primary-400 text-primary-800 shadow hover:shadow-lg",
};

export type FilledButtonProps = CommonButtonProps & {
  /**
   * Choose the kind of Button.
   */
  variant?: keyof typeof variants;
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
 * Most commonly used Button with background color set.
 */
export const FilledButton: React.FC<FilledButtonProps> = ({
  className = "",
  children,
  variant = "primary",
  size = "default",
  rounded = true,
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      defaultButtonBase,
      variants[variant],
      buttonSizes[size],
      rounded && "rounded",
      active && "border-b-2 border-primary-500"
    )}
    {...props}
  >
    {children}
  </button>
);
