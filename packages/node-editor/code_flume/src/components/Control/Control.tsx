import React from "react";
import styles from "./Control.module.css";
import Checkbox from "../Checkbox/Checkbox";
import TextInput from "../TextInput/TextInput";
import Select from "../Select/Select";
import { EditorContext, NodeDispatchContext } from "../../context";

type ControlProps = {
  type;
  name;
  nodeId;
  portName;
  label;
  inputLabel;
  data;
  allData;
  render;
  step;
  options;
  placeholder;
  inputData;
  recalculate;
  updateNodeConnections;
  getOptions;
  setValue;
  defaultValue;
  isMonoControl;
  recalculateStageRect: () => void;
};

export const Control: React.FC<ControlProps> = ({
  type,
  name,
  nodeId,
  portName,
  label,
  inputLabel,
  data,
  allData,
  render,
  step,
  options = [],
  placeholder,
  inputData,
  recalculate,
  updateNodeConnections,
  getOptions,
  setValue,
  defaultValue,
  isMonoControl,
  recalculateStageRect,
}) => {
  const nodesDispatch = React.useContext(NodeDispatchContext);
  const { executionContext } = React.useContext(EditorContext);

  const calculatedLabel = isMonoControl ? inputLabel : label;

  const onChange = (data) => {
    nodesDispatch({
      type: "SET_PORT_DATA",
      data,
      nodeId,
      portName,
      controlName: name,
      setValue,
    });
    recalculate();
  };

  const getControlByType = (type: string) => {
    const commonProps = {
      recalculate,
      updateNodeConnections,
      onChange,
      data,
    };

    switch (type) {
      case "select":
        return (
          <Select
            {...commonProps}
            options={
              getOptions ? getOptions(inputData, executionContext) : options
            }
            placeholder={placeholder}
          />
        );
      case "text":
        return (
          <TextInput
            {...commonProps}
            placeholder={placeholder}
            recalculateStageRect={recalculateStageRect}
          />
        );
      case "number":
        return (
          <TextInput
            {...commonProps}
            step={step}
            type="number"
            placeholder={placeholder}
            recalculateStageRect={recalculateStageRect}
          />
        );
      case "checkbox":
        return <Checkbox {...commonProps} label={calculatedLabel} />;
      case "multiselect":
        return (
          <Select
            allowMultiple
            {...commonProps}
            options={
              getOptions ? getOptions(inputData, executionContext) : options
            }
            placeholder={placeholder}
            label={label}
          />
        );
      case "custom":
        return render(
          data,
          onChange,
          executionContext,
          recalculate,
          {
            label,
            name,
            portName,
            inputLabel,
            defaultValue,
          },
          allData
        );
      default:
        return <div>Control</div>;
    }
  };

  return (
    <div className={styles.wrapper}>
      {calculatedLabel && type !== "checkbox" && type !== "custom" && (
        <label className={styles.controlLabel}>{calculatedLabel}</label>
      )}
      {getControlByType(type)}
    </div>
  );
};
