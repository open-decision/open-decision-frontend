import React from "react";
import { nodesActions } from "./nodesReducer";

export const NodeTypesContext = React.createContext();
export const PortTypesContext = React.createContext();
export const NodeDispatchContext = React.createContext<
  React.Dispatch<nodesActions>
>(() => null);
export const ConnectionRecalculateContext = React.createContext();
export const ContextContext = React.createContext();
export const StageContext = React.createContext();
export const CacheContext = React.createContext();
export const RecalculateStageRectContext = React.createContext();
export const EditorIdContext = React.createContext();
