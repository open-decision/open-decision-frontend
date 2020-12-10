import React from "react";
import styles from "./ColorPicker.module.css";

const Colors = {
  yellow: "yellow",
  orange: "orange",
  red: "red",
  pink: "pink",
  purple: "purple",
  blue: "blue",
  green: "green",
  grey: "grey",
};

type ColorPickerProps = {
  x: number;
  y: number;
  onColorPicked: (color: string) => void;
  onRequestClose: () => void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  x,
  y,
  onColorPicked,
  onRequestClose,
}) => {
  const wrapper = React.useRef<HTMLDivElement>();

  const testClickOutside = React.useCallback(
    (e) => {
      if (!wrapper.current.contains(e.target)) {
        onRequestClose();
        document.removeEventListener("click", testClickOutside);
        document.removeEventListener("contextmenu", testClickOutside);
      }
    },
    [wrapper, onRequestClose]
  );

  const testEscape = React.useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onRequestClose();
        document.removeEventListener("keydown", testEscape);
      }
    },
    [onRequestClose]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", testEscape);
    document.addEventListener("click", testClickOutside);
    document.addEventListener("contextmenu", testClickOutside);
    return () => {
      document.removeEventListener("click", testClickOutside);
      document.removeEventListener("contextmenu", testClickOutside);
      document.removeEventListener("keydown", testEscape);
    };
  }, [testClickOutside, testEscape]);

  return (
    <div
      ref={wrapper}
      className={styles.wrapper}
      style={{
        left: x,
        top: y,
      }}
    >
      {Object.values(Colors).map((color) => (
        <ColorButton
          onSelected={() => {
            onColorPicked(color);
            onRequestClose();
          }}
          color={color}
          key={color}
        />
      ))}
    </div>
  );
};

type ColorButtonProps = {
  color: string;
  onSelected: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const ColorButton: React.FC<ColorButtonProps> = ({ color, onSelected }) => (
  <div className={styles.colorButtonWrapper}>
    <button
      className={styles.colorButton}
      onClick={onSelected}
      data-color={color}
      aria-label={color}
    />
  </div>
);
