import React from "react";

export const useConditionalEffect = (fn: () => void, cond: boolean): void => {
  React.useEffect(() => (cond ? fn() : undefined), [fn, cond]);
};
