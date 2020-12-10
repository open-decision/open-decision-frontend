export * from "./hooks";
export const pluck = <T, K extends keyof T>(
  propertyNames: K[],
  o: T
): T[K][] => {
  return propertyNames.map((n) => o[n]);
};
