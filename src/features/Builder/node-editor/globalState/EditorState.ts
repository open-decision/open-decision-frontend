import produce from "immer";
import { merge } from "remeda";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { coordinates } from "../types";

type EditorConfig = {
  zoom: number;
  coordinates: coordinates;
  id: number;
};

export type EditorState = {
  editorConfig: EditorConfig;
  setEditorConfig: (editorConfig: Partial<EditorConfig>) => void;
};

export const useEditorStore = create<EditorState>(
  devtools(
    (set) => ({
      editorConfig: {
        zoom: 1,
        coordinates: [0, 0],
        initialized: false,
        id: 1234,
      },
      setEditorConfig: (editorConfig) =>
        set(
          produce((state: EditorState) => {
            state.editorConfig = merge(state.editorConfig, editorConfig);
          })
        ),
    }),
    "Editor"
  )
);
