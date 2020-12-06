import React from "react";
import styles from "./Checkbox.module.css";
import { nanoid } from "nanoid/non-secure";

const Checkbox = ({ label, data, onChange }) => {
  const id = React.useRef(nanoid(10));

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.checkbox}
        type="checkbox"
        id={id.current}
        value={data}
        checked={data}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className={styles.label} htmlFor={id.current}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
