import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";

export const badgeColors = {
  red: "text-red-900 bg-red-200",
  blue: "text-blue-900 bg-blue-200",
  green: "text-green-900 bg-green-200",
  yellow: "text-yellow-900 bg-yellow-200",
  indigo: "text-indigo-900 bg-indigo-200",
  purple: "text-purple-900 bg-purple-200",
  pink: "text-pink-900 bg-pink-200",
};

export type BadgeColors = keyof typeof badgeColors;

type Badge = { color: BadgeColors };

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & Badge> = ({
  children,
  className = "",
  color,
  ...props
}) => {
  return (
    <span
      className={clsx(
        className,
        "px-3 rounded-md font-semibold text-sm",
        pluck([color], badgeColors)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
