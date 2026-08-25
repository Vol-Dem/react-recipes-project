import { useEffect, useState } from "react";
import classes from "./Input.module.scss";
import { validateInput } from "../../utils/generalUtils";

const Input = ({
  id,
  type,
  name,
  label,
  input,
  className,
  onBlur,
  onChange,
  onClick,
  onFocus,
  error,
  autoFocus,
  value,
  placeholder,
  validation,
  showError,
}) => {
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    setShowErrorMessage(showError);
  }, [showError]);

  useEffect(() => {
    if (!!validation) {
      const { errorMessage } = validateInput(validation, value);

      setInputErrorMessage(errorMessage);
    }
    if (!validation) {
      setShowErrorMessage(false);
    }
  }, [value, validation]);

  return (
    <div>
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label || ""}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        onBlur={(e) => {
          if (onBlur) {
            onBlur(e);
          }
          if (validation && !validation?.disableErrorOnBlur) {
            setShowErrorMessage(true);
          }
        }}
        onChange={(e) => {
          if (validation) {
            const { isValid, errorMessage } = validateInput(
              validation,
              e.target.value
            );

            onChange(e, isValid, errorMessage);
            setInputErrorMessage(errorMessage);
          } else {
            onChange(e);
          }
        }}
        onClick={onClick}
        onFocus={onFocus}
        placeholder={placeholder}
        {...input}
        className={`${classes.input} ${className || ""}`}
        autoFocus={autoFocus}
        value={value}
      />
      {showErrorMessage && error && (
        <div className={classes.error}>{error}</div>
      )}
      {showErrorMessage && inputErrorMessage && (
        <div className={classes.error}>{inputErrorMessage}</div>
      )}
    </div>
  );
};

export default Input;
