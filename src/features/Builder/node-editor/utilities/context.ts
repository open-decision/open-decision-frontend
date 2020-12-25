import { EditorState, editorActions } from "../reducers";
import React from "react";

//This is the main Context of the NodeEditor. Analogous to useState it holds the state as the first item in the array and the dispatch function used to update the state as the second item.
export const EditorContext = React.createContext<
  [EditorState, React.Dispatch<editorActions>]
>([
  {
    id: "",
    zoom: 1,
    coordinates: [0, 0],
    nodes: {},
    comments: {},
    config: [{}, {}],
  },
  () => null,
]);
