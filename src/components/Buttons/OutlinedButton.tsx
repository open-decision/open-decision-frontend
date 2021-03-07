import clsx from "clsx";
import React from "react";
import {
  defaultButtonBase,
  buttonSizes,
  buttonVariants,
  CommonButtonProps,
} from "./shared";

const variants = {
  ...buttonVariants,
  primary:
    "border-2 border-primary-400 hover:bg-primary-200 text-primary-800 shadow hover:shadow-lg",
};

export type OutlinedButtonProps = CommonButtonProps & {
  variant?: keyof typeof variants;
  size?: keyof typeof buttonSizes;
  rounded?: boolean;
};

export const OutlinedButton: React.FC<OutlinedButtonProps> = ({
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
