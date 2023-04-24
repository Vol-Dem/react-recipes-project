import classes from "./Input.module.scss";
// import { forwardRef } from "react";

const Input = (props) => {
  const {
    label,
    input,
    // disabled,
    className,
    onBlur,
    onChange,
    error,
    autoFocus,
  } = props;
  const onBlurIvent = (e) => {
    onBlur(e.target.value);
  };
  const onChangeIvent = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      {label && (
        <label htmlFor={input.id} className={classes.label}>
          {label}
        </label>
      )}
      <input
        // ref={ref}
        // onChange={initialValue}
        onBlur={onBlurIvent}
        onChange={onChangeIvent}
        // disabled={disabled}
        {...input}
        className={`${classes.input} ${className || ""}`}
        autoFocus={autoFocus}
      />
      {error && <div className={classes.error}>{error}</div>}
    </>
  );
};

export default Input;
