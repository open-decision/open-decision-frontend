type translate = { x: number; y: number };

type action =
  | { type: "SET_SCALE"; scale: number }
  | { type: "SET_TRANSLATE"; translate: translate };

export type stageState = {
  scale: number;
  translate: translate;
};

export default (state: state, incomingAction: action | ((state) => action)) => {
  let action =
    typeof incomingAction === "function"
      ? incomingAction(state)
      : incomingAction;

  switch (action.type) {
    case "SET_SCALE":
      return { ...state, scale: action.scale };
    case "SET_TRANSLATE":
      return { ...state, translate: action.translate };
    default:
      return state;
  }
};
