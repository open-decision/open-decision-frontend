import React from "react";
import clsx from "clsx";
import { defaultButtonBase, CommonButtonProps } from "./shared";

const sizes = {
  small: "p-1",
  default: "p-2",
  large: "p-3",
};

export type IconButtonProps = CommonButtonProps & {
  size?: keyof typeof sizes;
};

export const IconButton: React.FC<IconButtonProps> = ({
  className = "",
  children,
  size = "default",
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      defaultButtonBase,
      "rounded-full overflow-hidden border-2",
      sizes[size],
      active ? "border-primary-500" : "border-gray-200"
    )}
    {...props}
  >
    {children}
  </button>
);
