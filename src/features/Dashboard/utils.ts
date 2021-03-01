import { formatWithOptions } from "date-fns/esm/fp";
import { de } from "date-fns/locale";
import { pipe, prop, map, flatten, uniq } from "remeda";
import type { ValidTreeNode } from "./types";
export const readableDate = (date: Date): string =>
  formatWithOptions({ locale: de })("P")(date);
export const getTags = (data: ValidTreeNode): string[] =>
  pipe(data, prop("tags"), map(prop("name")));
export const filterTags = (data: ValidTreeNode[]): string[] =>
  pipe(data, map(getTags), flatten(), uniq());
