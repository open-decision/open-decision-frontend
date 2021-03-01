import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { flow, identity, pipe } from "fp-ts/lib/function";
import type { All_TreesQuery } from "@internalTypes/generated/graphql";
import { Tags, TreeNode, ValidTreeNode } from "./types";

const parseTags = (tags: string) =>
  pipe(
    E.parseJSON(tags, E.toError),
    E.fold(
      () => [],
      (value) =>
        pipe(
          Tags.decode(value),
          E.fold(() => [], identity)
        )
    )
  );

const splitTreeData = (
  data: TreeNode[]
): { invalidData: string[]; validData: ValidTreeNode[] } => {
  const invalidData: any[] = [];
  const validData: ValidTreeNode[] = [];

  pipe(
    data,
    A.map(
      E.fold(
        (error) => invalidData.push(error),
        (value) => validData.push(value)
      )
    )
  );

  return { invalidData, validData };
};

export const validateTreeData = (
  data: All_TreesQuery
): { invalidData: string[]; validData: ValidTreeNode[] } => {
  const trees = data?.allDecisionTrees?.edges?.map((x) => x?.node) ?? [];

  const decodedData = pipe(
    trees,
    A.map(
      flow(
        (value) =>
          value && {
            ...value,
            tags: value?.tags ? parseTags(value.tags) : [],
          },
        TreeNode.decode
      )
    )
  );

  return splitTreeData(decodedData);
};
