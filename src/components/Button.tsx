import React from "react";
import clsx from "clsx";

const variantClasses = {
  filled:
    "bg-primary-300 hover:bg-primary-400 text-primary-800 shadow hover:shadow-lg",
  outlined:
    "border-2 border-primary-400 hover:bg-primary-200 text-primary-800 shadow hover:shadow-lg",
  text: "text-primary-900 hover:text-primary-700",
  ghost: "text-gray-600 hover:text-gray-800",
  icon: "rounded-full w-10 h-10 overflow-hidden",
};

const sizeClasses = {
  small: "py-1 px-2 text-sm",
  normal: "py-2 px-4",
  large: "text-xl py-3 px-5 md:text-2xl md:py-6 md:px-8",
  filled: "p-0",
};

type buttonTypes = keyof typeof variantClasses;
type buttonSizes = keyof typeof sizeClasses;

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: buttonTypes;
    size?: buttonSizes;
    rounded?: boolean;
    active?: boolean;
  }
>;

export const Button: Button = ({
  className = "",
  children,
  variant = "filled",
  size = "normal",
  rounded = true,
  active = false,
  ...props
}) => (
  <button
    className={clsx(
      className,
      "font-bold transition-all duration-100 inline-flex items-center clickable justify-center",
      sizeClasses[size],
      variantClasses[variant],
      rounded && "rounded",
      active && "border-b-2 border-primary-500"
    )}
    {...props}
  >
    {children}
  </button>
);
