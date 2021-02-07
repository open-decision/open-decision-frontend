import { useClickAway, useKeyPressEvent } from "react-use";
import create from "zustand";
import { coordinates } from "../../types";

type useModal = (ref: React.RefObject<HTMLDivElement>) => ModalState;

export const useModal: useModal = (ref) => {
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

  useClickAway(ref, () => closeModal());
  useKeyPressEvent("Escape", () => closeModal());

  return { open, coordinates, nodeId, openModal, closeModal };
};

type ModalState = {
  open: boolean;
  coordinates: coordinates;
  nodeId: string;
  openModal: (coordinates: coordinates, nodeId: string) => void;
  closeModal: () => void;
};

export const useModalState = create<ModalState>((set) => ({
  open: false,
  coordinates: [0, 0],
  nodeId: "",
  openModal: (coordinates, nodeId) => set({ open: true, coordinates, nodeId }),
  closeModal: () => set({ open: false, coordinates: [0, 0], nodeId: "" }),
}));
