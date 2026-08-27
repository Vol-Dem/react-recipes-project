import Button from "../../../../shared/components/ui/Button/Button";
import Input from "../../../../shared/components/ui/Input/Input";
import AuthMessages from "../AuthMessages/AuthMessages";
import classes from "./ResetPasswordForm.module.scss";

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
}) => (
  <form className={classes["auth__form"]} onSubmit={onSubmit}>
    <Input
      name="email"
      type="email"
      label="Email"
      value={email}
      validation={validation}
      showError={showError}
      disabled={isLoading}
      autoFocus={true}
      className={`${classes.input} ${emailIsInvalid ? classes.invalid : ""}`}
      onChange={onEmailChange}
    />
    <AuthMessages
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
    <Button>Reset password</Button>
  </form>
);

export default ResetPasswordForm;
