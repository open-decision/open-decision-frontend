import { EditorState, editorActions } from "../reducers";
import React from "react";

export const EditorDispatchContext = React.createContext<
  React.Dispatch<editorActions>
>(() => null);

export const EditorContext = React.createContext<EditorState>({
  id: "",
  zoom: 1,
  position: { x: 0, y: 0 },
  nodes: {},
  comments: {},
});
