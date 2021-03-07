import React from "react";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    className={clsx(
      "rounded w-full py-2 px-3 leading-tight  bg-gray-100 border-2 border-gray-300 shadow-inner",
      className
    )}
    {...props}
  />
);
