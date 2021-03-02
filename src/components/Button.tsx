import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";
import tw from "twin.macro";

const variants = {
  filled: tw`bg-green-300 hover:bg-green-400 text-green-800 shadow hover:shadow-lg`,
  outlined: tw`border-2 border-green-400 hover:bg-green-200 text-green-800 shadow hover:shadow-lg`,
  text: tw`text-green-900 hover:text-green-700`,
  ghost: tw`text-gray-600 hover:text-gray-800`,
  icon: tw`rounded-full w-10 h-10 overflow-hidden`,
} as const;

const sizes = {
  small: tw`py-1 px-2 text-sm`,
  normal: tw`py-2 px-4`,
  large: tw`text-xl py-3 px-5 md:text-2xl md:py-6 md:px-8`,
  filled: tw`p-0`,
} as const;

type buttonTypes = keyof typeof variants;
type buttonSizes = keyof typeof sizes;

type Button = React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    kind?: buttonTypes;
    size?: buttonSizes;
    rounded?: boolean;
    active?: boolean;
  }
>;

export const Button: Button = ({
  className = "",
  children,
  kind = "filled",
  size = "normal",
  rounded = true,
  active = false,
  ...props
}) => {
  console.log(className);

  return (
    <button
      css={[
        tw`font-bold transition-all duration-100 inline-flex items-center clickable justify-center`,
        rounded && tw`rounded`,
        active && tw`border-b-2 border-green-500`,
        pluck([size], sizes),
        pluck([kind], variants),
      ]}
      {...props}
    >
      {children}
    </button>
  );
};
