import React from "react";

export const useFunctionAfterLayout = (fn: () => void): (() => void) => {
  const [shouldRun, setShouldRun] = React.useState(true);

  React.useLayoutEffect(() => {
    if (shouldRun) {
      fn();
      setShouldRun(false);
    }
  }, [shouldRun, fn]);

  return () => setShouldRun(true);
};
