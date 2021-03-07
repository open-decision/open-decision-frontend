import React from "react";
import clsx from "clsx";
import { badgeColors as colors } from "internalTypes";

const sizes = {
  default: "px-3",
  large: "px-4 py-1",
};

export type BadgeProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> & {
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  color = "blue",
  size = "default",
  ...props
}) => {
  return (
    <span
      className={clsx(
        "rounded-md font-semibold text-sm",
        className,
        colors[color],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </span>
  );
};
