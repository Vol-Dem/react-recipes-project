import Button from "../../../../shared/components/ui/Button/Button";
import Input from "../../../../shared/components/ui/Input/Input";
import AuthMessages from "../AuthMessages/AuthMessages";
import classes from "./ResetPasswordForm.module.scss";
import type { FormEventHandler } from "react";
import type { InputChangeHandler } from "../../../../shared/components/ui/Input/Input";
import type { ValidationRules } from "../../../../shared/types/validation";

interface ResetPasswordFormProps {
  email: string;
  emailIsInvalid: boolean;
  errorMessage: string;
  isLoading: boolean;
  onEmailChange: InputChangeHandler;
  onSubmit: FormEventHandler<HTMLFormElement>;
  showError: boolean;
  successMessage: string;
  validation: ValidationRules;
}

const ResetPasswordForm = ({
  email,
  emailIsInvalid,
  errorMessage,
  isLoading,
  onEmailChange,
  onSubmit,
  showError,
  successMessage,
  validation,
}: ResetPasswordFormProps) => (
  <form noValidate className={classes["auth__form"]} onSubmit={onSubmit}>
    <Input
      id="reset-email"
      name="email"
      type="email"
      autoComplete="email"
      label="Email"
      value={email}
      validation={validation}
      showError={showError}
      disabled={isLoading}
      className={`${classes.input} ${emailIsInvalid ? classes.invalid : ""}`}
      onChange={onEmailChange}
    />
    <AuthMessages errorMessage={errorMessage} successMessage={successMessage} />
    <Button>Reset password</Button>
  </form>
);

export default ResetPasswordForm;
