import classes from "./Checkbox.module.scss";
import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
}

const Checkbox = ({ className, label, ...checkboxProps }: CheckboxProps) => {
  const generatedId = useId();
  const id = checkboxProps.id || generatedId;

  return (
    <div className={classes.field}>
      <input
        {...checkboxProps}
        id={id}
        type="checkbox"
        className={`${classes.checkbox} ${className || ""}`}
      />
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
