/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from "react";
import styles from "./ContextMenu.module.css";
import clamp from "lodash/clamp";
import { nanoid } from "nanoid/non-secure";
import { NodeConfig } from "@globalTypes/types";

export type menuOption = {
  value: string;
  label: string;
  description: string;
  sortIndex?: number;
  node?: NodeConfig;
  internalType?: "comment";
};

type ContextMenuProps = {
  x: number;
  y: number;
  options?: menuOption[];
  onRequestClose: () => void;
  onOptionSelected: (option: menuOption) => void;
  label?: string;
  hideHeader?: boolean;
  hideFilter?: boolean;
  emptyText?: string;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  options = [],
  onRequestClose,
  onOptionSelected,
  label,
  hideHeader,
  hideFilter,
  emptyText,
}) => {
  const menuWrapper = React.useRef<HTMLDivElement>(null);
  const menuOptionsWrapper = React.useRef<HTMLDivElement>(null);
  const filterInput = React.useRef<HTMLInputElement>(null);
  const [filter, setFilter] = React.useState("");
  const [menuWidth, setMenuWidth] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const menuId = React.useRef(nanoid(10));

  const handleOptionSelected = (option: menuOption) => {
    onOptionSelected(option);
    onRequestClose();
  };

  const testClickOutside = React.useCallback(
    (e) => {
      if (menuWrapper.current && !menuWrapper.current.contains(e.target)) {
        onRequestClose();
        document.removeEventListener("click", testClickOutside);
        document.removeEventListener("contextmenu", testClickOutside);
      }
    },
    [menuWrapper, onRequestClose]
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
    if (filterInput.current) {
      filterInput.current.focus();
    }
    menuWrapper.current
      ? setMenuWidth(menuWrapper?.current?.getBoundingClientRect().width)
      : null;
    document.addEventListener("keydown", testEscape);
    document.addEventListener("click", testClickOutside);
    document.addEventListener("contextmenu", testClickOutside);
    return () => {
      document.removeEventListener("click", testClickOutside);
      document.removeEventListener("contextmenu", testClickOutside);
      document.removeEventListener("keydown", testEscape);
    };
  }, [testClickOutside, testEscape]);

  const filteredOptions = React.useMemo(() => {
    if (!filter) return options;
    const lowerFilter = filter.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lowerFilter)
    );
  }, [filter, options]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Up pressed
    if (e.which === 38) {
      e.preventDefault();
      if (selectedIndex === null) {
        setSelectedIndex(0);
      } else if (selectedIndex > 0) {
        setSelectedIndex((i) => i - 1);
      }
    }
    // Down pressed
    if (e.which === 40) {
      e.preventDefault();
      if (selectedIndex === null) {
        setSelectedIndex(0);
      } else if (selectedIndex < filteredOptions.length - 1) {
        setSelectedIndex((i) => i + 1);
      }
    }
    // Enter pressed
    if (e.which === 13 && selectedIndex !== null) {
      const option = filteredOptions[selectedIndex];
      if (option) {
        handleOptionSelected(option);
      }
    }
  };

  React.useEffect(() => {
    if (hideFilter || hideHeader) {
      menuWrapper?.current?.focus();
    }
  }, [hideFilter, hideHeader]);

  React.useEffect(() => {
    const menuOption = document.getElementById(
      `${menuId.current}-${selectedIndex}`
    );
    if (menuOption) {
      const menuRect = menuOptionsWrapper?.current?.getBoundingClientRect();
      const optionRect = menuOption.getBoundingClientRect();
      if (
        optionRect.y + optionRect.height > menuRect!.y + menuRect!.height ||
        optionRect.y < menuRect!.y
      ) {
        menuOption.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      className={styles.menuWrapper}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      style={{
        left: x,
        top: y,
        width: filter ? menuWidth : "auto",
      }}
      ref={menuWrapper}
      tabIndex={0}
      role="menu"
      aria-activedescendant={`${menuId.current}-${selectedIndex}`}
    >
      {!hideHeader && (label ? true : !!options.length) ? (
        <div className={styles.menuHeader}>
          <label className={styles.menuLabel}>{label}</label>
          {!hideFilter && options.length ? (
            <input
              type="text"
              placeholder="Filter options"
              value={filter}
              onChange={handleFilterChange}
              className={styles.menuFilter}
              ref={filterInput}
            />
          ) : null}
        </div>
      ) : null}
      <div
        className={styles.optionsWrapper}
        role="menu"
        ref={menuOptionsWrapper}
        style={{ maxHeight: clamp(window.innerHeight - y - 70, 10, 300) }}
      >
        {filteredOptions.map((option, i) => (
          <ContextOption
            menuId={menuId.current}
            selected={selectedIndex === i}
            onClick={() => handleOptionSelected(option)}
            onMouseEnter={() => setSelectedIndex(0)}
            index={i}
            key={option.value + i}
          >
            <label>{option.label}</label>
            {option.description ? <p>{option.description}</p> : null}
          </ContextOption>
        ))}
        {!options.length ? (
          <span className={styles.emptyText}>{emptyText}</span>
        ) : null}
      </div>
    </div>
  );
};

type ContextOptionProps = {
  menuId: string;
  index: number;
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

const ContextOption: React.FC<ContextOptionProps> = ({
  menuId,
  index,
  children,
  onClick,
  selected,
  onMouseEnter,
}) => {
  return (
    <div
      className={styles.option}
      role="menuitem"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-selected={selected}
      id={`${menuId}-${index}`}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
