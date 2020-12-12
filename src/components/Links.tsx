import { pluck } from "@utils/index";
import clsx from "clsx";
import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

const variants = {
  default: "",
  icon:
    "rounded-full w-10 h-10 overflow-hidden flex justify-center items-center clickable",
  button:
    "bg-green-300 hover:bg-green-400 text-green-800 shadow hover:shadow-lg py-2 px-4 rounded font-bold",
} as const;

type linkVariants = keyof typeof variants;

type InternalLink = React.FC<
  LinkProps & { variant?: linkVariants; className?: string }
>;

export const InternalLink: InternalLink = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  return (
    <RouterLink
      className={clsx(
        pluck([variant], variants),
        className,
        "no-underline text-base"
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

type Link = React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: linkVariants;
    className?: string;
  }
>;

export const Link: Link = ({
  children,
  variant = "default",
  className,
  ...props
}) => (
  <a
    className={clsx(
      pluck([variant], variants),
      className,
      "no-underline text-base"
    )}
    {...props}
  >
    {children}
  </a>
);
