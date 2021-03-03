import { clamp } from "remeda";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { coordinates } from "../types";

export const editorZoomMinimum = 0.5;
export const editorZoomMaximum = 3;

export type EditorState = {
  /**
   * The zoom level of the Editor.
   */
  zoom: number;
  /**
   * The coordinates the Editor is translated by.
   */
  coordinates: coordinates;
  /**
   * Sets new coordinates in the global editor state.
   * @param coordinates - New Coordinates of the Editor.
   */
  setCoordinates: (coordinates: coordinates) => void;
  /**
   * Sets the zoom level of the Editor. The provided zoom parameter is transformed into a new zoom value. The min and max zoom level is defined in `editorZoomMinimum` and `editorZoomMaximum` respectively.
   * @param zoomIntention - Number indicating the zoom intention.
   */
  setZoom: (zoomIntention: number) => void;
};

export const useEditorStore = create<EditorState>(
  devtools(
    (set) => ({
      zoom: 1,
      coordinates: [0, 0],
      setCoordinates: (coordinates) => set({ coordinates }),
      setZoom: (zoomIntention) =>
        set((state) => ({
          zoom: clamp(
            state.zoom - clamp(zoomIntention, { min: -10, max: 10 }) * 0.005,
            {
              min: editorZoomMinimum,
              max: editorZoomMaximum,
            }
          ),
        })),
    }),
    "Editor"
  )
);
