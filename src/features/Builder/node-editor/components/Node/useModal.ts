import { useClickAway, useKeyPressEvent } from "react-use";
import create from "zustand";
import { coordinates } from "../../types";
import React from "react";

type useModal = () => ModalState & { ref: React.MutableRefObject<null> };

export const useModal: useModal = () => {
  const [
    open,
    coordinates,
    nodeId,
    openModal,
    closeModal,
  ] = useModalState((state) => [
    state.open,
    state.coordinates,
    state.nodeId,
    state.openModal,
    state.closeModal,
  ]);

  const ref = React.useRef(null);

  useClickAway(ref, () => closeModal());
  useKeyPressEvent("Escape", () => closeModal());

  return { open, coordinates, nodeId, openModal, closeModal, ref };
};

type ModalState = {
  open: boolean;
  coordinates: coordinates;
  nodeId: string;
  openModal: (coordinates: coordinates, nodeId: string) => void;
  closeModal: () => void;
};

const useModalState = create<ModalState>((set) => ({
  open: false,
  coordinates: [0, 0],
  nodeId: "",
  openModal: (coordinates, nodeId) => set({ open: true, coordinates, nodeId }),
  closeModal: () => set({ open: false, coordinates: [0, 0], nodeId: "" }),
}));
