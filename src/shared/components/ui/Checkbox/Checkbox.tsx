import classes from "./Checkbox.module.scss";
import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
}

const Checkbox = ({ className, label, ...checkboxProps }: CheckboxProps) => {
  const { id } = checkboxProps;

  return (
    <div className={classes.field}>
      <input
        {...checkboxProps}
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
