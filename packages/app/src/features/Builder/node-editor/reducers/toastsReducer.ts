import { toast, toastType } from "../components/Toaster/Toaster";
import produce, { Draft } from "immer";
import { nanoid } from "nanoid/non-secure";

export type toastActions =
  | {
      type: "ADD_TOAST";
      title: string;
      message: string;
      toastType: toastType;
      duration: number;
    }
  | { type: "SET_HEIGHT"; height: number; id: string }
  | { type: "SET_EXITING"; id: string }
  | { type: "REMOVE_TOAST"; id: string };

export const toastsReducer = produce(
  (draft: Draft<toast[]>, action: toastActions) => {
    switch (action.type) {
      case "ADD_TOAST":
        draft.push({
          id: nanoid(5),
          title: action.title,
          message: action.message,
          type: action.toastType || "info",
          duration: action.duration || 10000,
          height: 0,
          exiting: false,
        });
        break;

      case "SET_HEIGHT": {
        const index = draft.findIndex((t) => t.id === action.id);
        draft[index].height = action.height;
        break;
      }

      case "SET_EXITING": {
        const index = draft.findIndex((t) => t.id === action.id);
        draft[index].exiting = true;
        break;
      }

      case "REMOVE_TOAST": {
        const index = draft.findIndex((t) => t.id === action.id);
        draft.splice(index, 1);
        break;
      }
    }
  }
);
