import { useEffect, useState } from "react";
import { validateInput } from "../utils/validation";

export const useInputValidation = ({
  onBlur,
  onChange,
  showError,
  validation,
  value,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldShowError, setShouldShowError] = useState(false);

  useEffect(() => {
    setShouldShowError(showError);
  }, [showError]);

  useEffect(() => {
    if (validation) {
      const result = validateInput(validation, value);

      setErrorMessage(result.errorMessage);
      return;
    }

    setShouldShowError(false);
  }, [value, validation]);

  const handleBlur = (event) => {
    onBlur?.(event);

    if (validation && !validation.disableErrorOnBlur) {
      setShouldShowError(true);
    }
  };

  const handleChange = (event) => {
    if (!validation) {
      onChange?.(event);
      return;
    }

    const result = validateInput(validation, event.target.value);

    onChange?.(event, result.isValid, result.errorMessage);
    setErrorMessage(result.errorMessage);
  };

  return {
    errorMessage,
    handleBlur,
    handleChange,
    shouldShowError,
  };
};
