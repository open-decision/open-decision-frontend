import produce from "immer";
import { clamp } from "remeda";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { coordinates } from "../types";

export const editorZoomMinimum = 0.5;
export const editorZoomMaximum = 3;

export type EditorState = {
  zoom: number;
  coordinates: coordinates;
  setCoordinates: (coordinates: coordinates) => void;
  setEditorZoom: (zoom: number) => void;
};

export const useEditorStore = create<EditorState>(
  devtools(
    (set) => ({
      zoom: 0,
      coordinates: [0, 0],
      setCoordinates: (coordinates) =>
        set(
          produce((state: EditorState) => {
            state.coordinates = coordinates;
          })
        ),
      setEditorZoom: (zoom) =>
        set(
          produce((state: EditorState) => {
            state.zoom = clamp(
              state.zoom - clamp(zoom, { min: -10, max: 10 }) * 0.005,
              {
                min: editorZoomMinimum,
                max: editorZoomMaximum,
              }
            );
          })
        ),
    }),
    "Editor"
  )
);
