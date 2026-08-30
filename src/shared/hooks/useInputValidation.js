import { useEffect, useState } from "react";
import { validateInput } from "../utils/validation";

export const useInputValidation = ({
  onBlur,
  onChange,
  showError,
  validation,
  value,
}) => {
  const [shouldShowError, setShouldShowError] = useState(false);
  const validationResult = validation ? validateInput(validation, value) : null;
  const errorMessage = validationResult?.errorMessage || "";

  useEffect(() => {
    setShouldShowError(showError);
  }, [showError]);

  useEffect(() => {
    if (!validation) {
      setShouldShowError(false);
    }
  }, [validation]);

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
  };

  return {
    errorMessage,
    handleBlur,
    handleChange,
    shouldShowError,
  };
};
