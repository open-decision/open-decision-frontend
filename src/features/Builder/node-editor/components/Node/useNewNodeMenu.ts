import { useClickAway, useKeyPressEvent } from "react-use";
import create from "zustand";
import { coordinates } from "../../types";
import React from "react";

type useModal = () => ModalState & { ref: React.MutableRefObject<null> };

export const useNewNodeMenu: useModal = () => {
  const [
    isMenuOpen,
    coordinates,
    nodeId,
    openMenu,
    closeMenu,
  ] = useMenuState((state) => [
    state.isMenuOpen,
    state.coordinates,
    state.nodeId,
    state.openMenu,
    state.closeMenu,
  ]);

  const ref = React.useRef(null);

  useClickAway(ref, () => closeMenu());
  useKeyPressEvent("Escape", () => closeMenu());

  return {
    isMenuOpen,
    coordinates,
    nodeId,
    openMenu: openMenu,
    closeMenu: closeMenu,
    ref,
  };
};

type ModalState = {
  isMenuOpen: boolean;
  coordinates: coordinates;
  nodeId: string;
  openMenu: (coordinates: coordinates, nodeId: string) => void;
  closeMenu: () => void;
};

const useMenuState = create<ModalState>((set) => ({
  isMenuOpen: false,
  coordinates: [0, 0],
  nodeId: "",
  openMenu: (coordinates, nodeId) =>
    set({ isMenuOpen: true, coordinates, nodeId }),
  closeMenu: () => set({ isMenuOpen: false, coordinates: [0, 0], nodeId: "" }),
}));
