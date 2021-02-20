import create from "zustand";

type SidebarState = {
  open: boolean;
  nodeId: string;
  nodeType: string;
  openSidebar: (nodeId: string, nodeType: string) => void;
  closeSidebar: () => void;
};

export const useSidebarState = create<SidebarState>((set) => ({
  open: false,
  nodeId: "",
  nodeType: "",
  openSidebar: (nodeId, nodeType) => set({ open: true, nodeId, nodeType }),
  closeSidebar: () => set({ open: false, nodeId: "", nodeType: "" }),
}));
