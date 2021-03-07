import clsx from "clsx";
import React from "react";
import { Input } from "./Input";

const variants = {
  block: "space-y-2",
  inline: "flex items-center space-x-6",
};

export type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  variant?: keyof typeof variants;
  containerClasses?: string;
  labelClasses?: string;
  inputClasses?: string;
};

/**
 * A Field combines an Input with a label and takes care of accessibility requirements. The variant determines the layout of the label in relation to the input.
 */
export const Field: React.FC<FieldProps> = ({
  containerClasses,
  labelClasses,
  inputClasses,
  name,
  label,
  variant = "block",
  ...props
}) => {
  return (
    <div className={clsx(variants[variant], containerClasses)}>
      <label
        htmlFor={name}
        className={clsx("text-gray-700 font-semibold min-w-max", labelClasses)}
      >
        {label}
      </label>
      <Input className={inputClasses} {...props} />
    </div>
  );
};
