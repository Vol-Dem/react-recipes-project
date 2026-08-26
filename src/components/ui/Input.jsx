import { useEffect, useState } from "react";
import classes from "./Input.module.scss";
import { validateInput } from "../../utils/generalUtils";

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

  const blurHandler = (event) => {
    onBlur?.(event);

    if (validation && !validation.disableErrorOnBlur) {
      setShowErrorMessage(true);
    }
  };

  const changeHandler = (event) => {
    if (validation) {
      const { isValid, errorMessage } = validateInput(
        validation,
        event.target.value,
      );

      onChange?.(event, isValid, errorMessage);
      setInputErrorMessage(errorMessage);
      return;
    }

    onChange?.(event);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className={classes.label}>
          {label || ""}
        </label>
      )}
      <input
        {...inputProps}
        onBlur={blurHandler}
        onChange={changeHandler}
        placeholder={placeholder}
        className={`${classes.input} ${className || ""}`}
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
