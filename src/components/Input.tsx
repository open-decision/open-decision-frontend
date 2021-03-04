import React from "react";
import clsx from "clsx";

const inputVariants = {
  default:
    "rounded w-full py-2 px-3 leading-tight  bg-gray-100 border-2 border-gray-300 shadow-inner",
} as const;

type inputVariants = keyof typeof inputVariants;

export type Input = React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    variant?: inputVariants;
  }
>;

export const Input: Input = ({ className, variant = "default", ...props }) => (
  <input className={clsx(inputVariants[variant], className)} {...props} />
);
