import React from "react";
import { coordinates } from "../types";

type useContextMenuReturn = {
  menuOpen: boolean;
  menuCoordinates: coordinates;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const useContextMenu = (
  coordinates?: coordinates
): useContextMenuReturn => {
  /**
   * This tracks the state of the ContextMenu.
   */
  const [menuOpen, setMenuOpen] = React.useState(false);

  /**
   * This tracks the Coordinates of the ContextMenu.
   */
  const [menuCoordinates, setMenuCoordinates] = React.useState<coordinates>(
    coordinates || {
      x: 0,
      y: 0,
    }
  );

  /**
   * Handles opening the ContextMenu.
   */
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();

    setMenuCoordinates({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  return { menuOpen, menuCoordinates, setMenuOpen, handleContextMenu };
};
