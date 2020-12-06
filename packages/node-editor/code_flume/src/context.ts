import { NodeTypes, PortTypes } from "@globalTypes/types";
import { cache } from "cache";
import React from "react";
import { stageState } from "stageReducer";
import { nodesActions } from "./nodesReducer";

export const NodeTypesContext = React.createContext<NodeTypes>(undefined);
export const PortTypesContext = React.createContext<PortTypes>(undefined);
export const NodeDispatchContext = React.createContext<
  React.Dispatch<nodesActions>
>(() => null);
export const ConnectionRecalculateContext = React.createContext(() => null);
export const ContextContext = React.createContext({});
export const StageContext = React.createContext<stageState>(undefined);
export const CacheContext = React.createContext<React.MutableRefObject<cache>>(
  undefined
);
export const RecalculateStageRectContext = React.createContext(() => null);
export const EditorIdContext = React.createContext("");
