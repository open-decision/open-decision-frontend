import React from "react";
import { Portal } from "react-portal";
import ContextMenu from "../ContextMenu/ContextMenu";
import styles from "./Select.module.css";

const MAX_LABEL_LENGTH = 50;

type option = { label: string; description: string; value: string };

type SelectProps = {
  options: option[];
  placeholder: string;
  onChange: any;
  data: any;
  label?: string;
  allowMultiple?: boolean;
};

const Select: React.FC<SelectProps> = ({
  options = [],
  placeholder = "Select an option",
  onChange,
  data,
  label,
  allowMultiple,
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerCoordinates, setDrawerCoordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const wrapper = React.useRef<HTMLDivElement>();

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openDrawer = () => {
    if (!drawerOpen) {
      const wrapperRect = wrapper.current.getBoundingClientRect();
      setDrawerCoordinates({
        x: wrapperRect.x,
        y: wrapperRect.y + wrapperRect.height,
      });
      setDrawerOpen(true);
    }
  };

  const handleOptionSelected = (option) => {
    if (allowMultiple) {
      onChange([...data, option.value]);
    } else {
      onChange(option.value);
    }
  };

  const handleOptionDeleted = (optionIndex) => {
    onChange([...data.slice(0, optionIndex), ...data.slice(optionIndex + 1)]);
  };

  const getFilteredOptions = () =>
    allowMultiple
      ? options.filter((option) => !data.includes(option.value))
      : options;

  const selectedOption = React.useMemo(() => {
    const option = options.find((option) => option.value === data);
    if (option) {
      return {
        ...option,
        label:
          option.label.length > MAX_LABEL_LENGTH
            ? option.label.slice(0, MAX_LABEL_LENGTH) + "..."
            : option.label,
      };
    }
  }, [options, data]);

  return (
    <React.Fragment>
      {allowMultiple ? (
        data.length ? (
          <div className={styles.chipsWrapper}>
            {data.map((val, i) => {
              const optLabel =
                (options.find((option) => option.value === val) || {}).label ||
                "";
              return (
                <OptionChip
                  onRequestDelete={() => handleOptionDeleted(i)}
                  key={val}
                >
                  {optLabel}
                </OptionChip>
              );
            })}
          </div>
        ) : null
      ) : data ? (
        <SelectedOption
          wrapperRef={wrapper}
          option={selectedOption}
          onClick={openDrawer}
        />
      ) : null}
      {(allowMultiple || !data) && (
        <div ref={wrapper} onClick={openDrawer}>
          {placeholder}
        </div>
      )}
      {drawerOpen && (
        <Portal>
          <ContextMenu
            x={drawerCoordinates.x}
            y={drawerCoordinates.y}
            emptyText="There are no options"
            options={getFilteredOptions()}
            onOptionSelected={handleOptionSelected}
            onRequestClose={closeDrawer}
          />
        </Portal>
      )}
    </React.Fragment>
  );
};

export default Select;

type SeclectOptionProps = {
  option: option;
  wrapperRef: React.MutableRefObject<HTMLDivElement>;
  onClick: () => void;
};

const SelectedOption: React.FC<SeclectOptionProps> = ({
  option = {},
  wrapperRef,
  onClick,
}) => (
  <div className={styles.selectedWrapper} onClick={onClick} ref={wrapperRef}>
    <label>{option.label}</label>
    {option.description ? <p>{option.description}</p> : null}
  </div>
);

const OptionChip = ({ children, onRequestDelete }) => (
  <div className={styles.chipWrapper}>
    {children}
    <button
      className={styles.deleteButton}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={onRequestDelete}
    >
      ✕
    </button>
  </div>
);
