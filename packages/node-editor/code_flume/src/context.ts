import { NodeTypes } from "@globalTypes/types";
import React from "react";
import { stageState } from "stageReducer";
import { nodesActions } from "./nodesReducer";

export const NodeTypesContext = React.createContext<NodeTypes>({});
export const PortTypesContext = React.createContext();
export const NodeDispatchContext = React.createContext<
  React.Dispatch<nodesActions>
>(() => null);
export const ConnectionRecalculateContext = React.createContext();
export const ContextContext = React.createContext();
export const StageContext = React.createContext<stageState>({
  scale: 1,
  translate: { x: 0, y: 0 },
});
export const CacheContext = React.createContext<any>(undefined);
export const RecalculateStageRectContext = React.createContext();
export const EditorIdContext = React.createContext();
