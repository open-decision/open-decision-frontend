import { pluck } from "@utils/index";
import clsx from "clsx";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

type IconButton = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: iconVariants;
  }
>;

const iconVariants = {
  base:
    "rounded-full w-10 h-10 overflow-hidden border-4 border-gray-100 flex justify-center items-center",
};

type iconVariants = keyof typeof iconVariants;

export const IconButton: IconButton = ({
  className,
  children,
  variant,
  ...props
}) => (
  <button
    className={clsx(pluck(iconVariants, ["base", variant]), className)}
    {...props}
  >
    {children}
  </button>
);

type IconLink = React.FC<
  LinkProps & { className?: string; variant?: iconVariants }
>;

export const IconLink: IconLink = ({
  className,
  children,
  to,
  variant,
  ...props
}) => (
  <Link
    to={to}
    className={clsx(pluck(iconVariants, ["base", variant]), className)}
    {...props}
  >
    {children}
  </Link>
);