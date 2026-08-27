import Input from "../../../../shared/components/ui/Input/Input";
import classes from "./AuthFields.module.scss";

const AuthFields = ({
  email,
  emailIsInvalid,
  emailValidation,
  isLoading,
  onEmailChange,
  onPasswordChange,
  password,
  passwordIsInvalid,
  passwordValidation,
  showError,
}) => {
  const emailClassName = `${classes.input} ${
    emailIsInvalid ? classes.invalid : ""
  }`;
  const passwordClassName = `${classes.input} ${
    passwordIsInvalid ? classes.invalid : ""
  }`;

  return (
    <>
    <Input
      id="email"
      name="email"
      type="email"
      label="Email"
      value={email}
      validation={emailValidation}
      showError={showError}
      disabled={isLoading}
      autoFocus={true}
      className={emailClassName}
      onChange={onEmailChange}
    />
    <Input
      id="password"
      name="password"
      type="password"
      label="Password"
      value={password}
      validation={passwordValidation}
      showError={showError}
      disabled={isLoading}
      className={passwordClassName}
      onChange={onPasswordChange}
    />
    </>
  );
};

export default AuthFields;
