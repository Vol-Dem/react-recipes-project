import classes from "./Input.module.scss";

const Input = (props) => {
  const { label, input, className, onBlur, onChange, error, autoFocus } = props;
  const onBlurIvent = (e) => {
    onBlur && onBlur(e.target.value);
  };
  const onChangeIvent = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <>
      {label && (
        <label htmlFor={input.id} className={classes.label}>
          {label}
        </label>
      )}
      <input
        onBlur={onBlurIvent}
        onChange={onChangeIvent}
        {...input}
        className={`${classes.input} ${className || ""}`}
        autoFocus={autoFocus}
      />
      {error && <div className={classes.error}>{error}</div>}
    </>
  );
};

export default Input;
