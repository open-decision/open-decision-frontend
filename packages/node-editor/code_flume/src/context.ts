import { cache } from "cache";
import { EditorState } from "editorReducer";
import React from "react";
import { nodesActions } from "./nodesReducer";

export const NodeDispatchContext = React.createContext<
  React.Dispatch<nodesActions>
>(() => null);

export const CacheContext = React.createContext<React.MutableRefObject<cache>>(
  undefined
);
export const EditorContext = React.createContext<EditorState>({
  id: "",
  scale: 1,
  translate: { x: 0, y: 0 },
  executionContext: {},
});
