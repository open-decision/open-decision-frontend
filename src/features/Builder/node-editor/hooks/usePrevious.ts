import React from "react";

export const usePrevious = <T>(value: T): T => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current as T;
};
