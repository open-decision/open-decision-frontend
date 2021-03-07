import React from "react";
import { matchSorter } from "match-sorter";
import { readableDate } from "./utils";
import { parseISO } from "date-fns/esm";
import { Field } from "components";
import { Tag, ValidTreeNode } from "./types";

type GlobalFilter = {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Search: React.FunctionComponent<GlobalFilter> = ({
  value,
  setValue,
  className,
  ...props
}) => (
  <Field
    containerClasses={className}
    variant="inline"
    name="search"
    label="Suche: "
    value={value || ""}
    onChange={(e) => setValue(e.target.value)}
    {...props}
  />
);

export const fuzzySearch = (
  data: ValidTreeNode[],
  filterValue: string
): ValidTreeNode[] => {
  return matchSorter(data, filterValue, {
    keys: [
      "name",
      (data) => readableDate(parseISO(data.createdAt)),
      (data) => data.tags.map((tag: Tag) => tag.name),
    ],
  });
};

export const sortByKey = (
  data: ValidTreeNode[],
  key: string
): ValidTreeNode[] => {
  return matchSorter(data, "", { keys: [key] });
};
