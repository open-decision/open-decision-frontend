import clsx from "clsx";
import React from "react";
import { Input } from "./Input";

export const FileInput: Input = ({ className, children, ...props }) => (
  <label
    className={clsx(
      className,
      "min-w-max flex flex-col items-center px-4 py-6 text-primary-900 rounded-lg tracking-wide uppercase border-2 border-primary-800 cursor-pointer hover:bg-primary-100 clickable shadow-inner bg-gray-100"
    )}
  >
    <svg
      className="w-8 h-8"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
    </svg>
    <span className="mt-2 text-base leading-normal">{children}</span>
    <input type="file" className="hidden" {...props} />
  </label>
);
