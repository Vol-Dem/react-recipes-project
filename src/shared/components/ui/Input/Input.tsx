import classes from "./Input.module.scss";
import { useInputValidation } from "../../../hooks/useInputValidation";
import { useId } from "react";
import type { FocusEventHandler, InputHTMLAttributes, ReactNode } from "react";
import type { ValidationRules } from "../../../types/validation";

export type InputChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  isValid?: boolean,
  errorMessage?: string,
) => void;

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  error?: ReactNode;
  label?: ReactNode;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: InputChangeHandler;
  showError?: boolean;
  validation?: ValidationRules;
}

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
}: InputProps) => {
  const generatedId = useId();
  const {
    id: providedId,
    value,
    "aria-describedby": providedDescription,
  } = inputProps;
  const inputId = providedId || generatedId;
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
  const externalErrorId = `${inputId}-external-error`;
  const validationErrorId = `${inputId}-validation-error`;
  const hasExternalError = shouldShowError && Boolean(error);
  const hasValidationError = shouldShowError && Boolean(validationErrorMessage);
  const describedBy = [
    providedDescription,
    hasExternalError ? externalErrorId : undefined,
    hasValidationError ? validationErrorId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={classes.label}>
          {label || ""}
        </label>
      )}
      <input
        {...inputProps}
        id={inputId}
        aria-describedby={describedBy || undefined}
        aria-invalid={
          hasExternalError || hasValidationError ? "true" : undefined
        }
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${classes.input} ${className || ""}`}
      />
      {hasExternalError && (
        <div id={externalErrorId} className={classes.error} role="alert">
          {error}
        </div>
      )}
      {hasValidationError && (
        <div id={validationErrorId} className={classes.error} role="alert">
          {validationErrorMessage}
        </div>
      )}
    </div>
  );
};

export default Input;
