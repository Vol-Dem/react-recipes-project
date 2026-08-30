import classes from "./Input.module.scss";
import { useInputValidation } from "../../../hooks/useInputValidation";

const Input = ({
  label,
  className,
  onBlur,
  onChange,
  error,
  placeholder,
  validation,
  showError,
  ...inputProps
}) => {
  const { id, value } = inputProps;
  const {
    errorMessage: validationErrorMessage,
    handleBlur,
    handleChange,
    shouldShowError,
  } = useInputValidation({
    onBlur,
    onChange,
    showError,
    validation,
    value,
  });

  return (
    <div>
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label || ""}
        </label>
      )}
      <input
        {...inputProps}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${classes.input} ${className || ""}`}
      />
      {shouldShowError && error && <div className={classes.error}>{error}</div>}
      {shouldShowError && validationErrorMessage && (
        <div className={classes.error}>{validationErrorMessage}</div>
      )}
    </div>
  );
};

export default Input;
