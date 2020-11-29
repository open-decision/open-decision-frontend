import nanoid from "nanoid/non-secure/index";
import { comments } from "./types";

const setComment = (comments, id, merge) => ({
  ...comments,
  [id]: {
    ...comments[id],
    ...merge,
  },
});

type action =
  | {
      type: "ADD_COMMENT";
      x: number;
      y: number;
    }
  | { type: "REMOVE_COMMENT_NEW"; id: number }
  | { type: "SET_COMMENT_COORDINATES"; id: number; x: number; y: number }
  | {
      type: "SET_COMMENT_DIMENSIONS";
      id: number;
      width: number;
      height: number;
    }
  | { type: "SET_COMMENT_TEXT"; id: number; text: string }
  | { type: "SET_COMMENT_COLOR"; id: number; color: string }
  | { type: "DELETE_COMMENT"; id: number };

export const commentsReducer = (
  comments: comments = {},
  action: action
): comments => {
  switch (action.type) {
    case "ADD_COMMENT": {
      const comment = {
        id: nanoid(10),
        text: "",
        x: action.x,
        y: action.y,
        width: 200,
        height: 30,
        color: "blue",
        isNew: true,
      };
      return {
        ...comments,
        [comment.id]: comment,
      };
    }

    case "REMOVE_COMMENT_NEW":
      const { isNew: toDelete, ...comment } = comments[action.id];
      return {
        ...comments,
        [action.id]: comment,
      };

    case "SET_COMMENT_COORDINATES": {
      return setComment(comments, action.id, { x: action.x, y: action.y });
    }

    case "SET_COMMENT_DIMENSIONS": {
      return setComment(comments, action.id, {
        width: action.width,
        height: action.height,
      });
    }

    case "SET_COMMENT_TEXT": {
      return setComment(comments, action.id, { text: action.text });
    }

    case "SET_COMMENT_COLOR": {
      return setComment(comments, action.id, { color: action.color });
    }

    case "DELETE_COMMENT": {
      const { [action.id]: toDelete, ...newComments } = comments;
      return newComments;
    }

    default:
      return comments;
  }
};
