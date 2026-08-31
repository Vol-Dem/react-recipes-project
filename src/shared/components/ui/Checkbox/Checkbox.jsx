import classes from "./Checkbox.module.scss";

const Checkbox = ({ className, label, ...checkboxProps }) => {
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
