import { useEffect, useState } from "react";
import { validateInput } from "../utils/validation";
import type { FocusEvent, ChangeEvent } from "react";
import type { InputChangeHandler } from "../components/ui/Input/Input";
import type { ValidationRules } from "../types/validation";

interface InputValidationOptions {
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: InputChangeHandler;
  showError?: boolean;
  validation?: ValidationRules;
  value?: string | number | readonly string[];
}

export const useInputValidation = ({
  onBlur,
  onChange,
  showError,
  validation,
  value,
}: InputValidationOptions) => {
  const [shouldShowError, setShouldShowError] = useState(false);
  const stringValue = String(value ?? "");
  const validationResult = validation
    ? validateInput(validation, stringValue)
    : null;
  const errorMessage = validationResult?.errorMessage || "";

  useEffect(() => {
    setShouldShowError(Boolean(showError));
  }, [showError]);

  useEffect(() => {
    if (!validation) {
      setShouldShowError(false);
    }
  }, [validation]);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);

    if (validation && !validation.disableErrorOnBlur) {
      setShouldShowError(true);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
