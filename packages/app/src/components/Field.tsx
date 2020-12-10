import clsx from "clsx";
import React from "react";
import { Input } from "./Inputs";

type Field = React.InputHTMLAttributes<HTMLInputElement> & {
  classNames?: { box?: string; label?: string; input?: string };
  name: string;
  label: string;
  layout?: "block" | "inline";
};

export const Field: React.FC<Field> = ({
  classNames = { box: "", label: "", input: "" },
  name,
  label,
  layout = "block",
  ...props
}) => {
  return (
    <div
      className={clsx(
        {
          "flex items-center space-x-6": layout === "inline",
          "space-y-2": layout === "block",
        },
        classNames.box
      )}
    >
      <label
        htmlFor={name}
        className={clsx("text-gray-700 font-semibold", classNames.label)}
      >
        {label}
      </label>
      <Input className={classNames.input} {...props} />
    </div>
  );
};
