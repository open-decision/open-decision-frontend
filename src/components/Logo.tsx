import clsx from "clsx";
import React from "react";
import { InternalLink } from "./Links";

export const Logo: React.FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  return (
    <InternalLink to="/">
      <h1 className={clsx("text-gray-800 font-bold w-44", className)}>
        <img src="/assets/icons/OD_LOGO.svg" alt="" className="logo" />
        {/* open <span className="text-red-500">decision</span> */}
      </h1>
    </InternalLink>
  );
};
