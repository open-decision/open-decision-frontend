import * as T from "io-ts";
import * as E from "fp-ts/lib/Either";
import { withMessage } from "io-ts-types/lib/withMessage";
import { badgeColors } from "@components/Badge";

export const Tag = T.type({
  name: T.string,
  color: T.keyof(badgeColors),
});
export const Tags = T.array(Tag);
export type Tag = T.TypeOf<typeof Tag>;

export const TreeNode = withMessage(
  T.type({
    name: T.string,
    id: T.string,
    createdAt: T.string,
    tags: Tags,
  }),
  () => "Could not verify tree data"
);
export type ValidTreeNode = T.TypeOf<typeof TreeNode>;
export type TreeNode = E.Either<T.Errors, ValidTreeNode>;
