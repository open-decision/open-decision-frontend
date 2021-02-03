import clsx from "clsx";
import React from "react";

export const Port = ({ className }) => {
  return (
    <div
      className={clsx(
        className,
        "rounded-full h-4 w-4 bg-red-500 border-2 border-gray-200 shadow-md flex"
      )}
    ></div>
  );
};
