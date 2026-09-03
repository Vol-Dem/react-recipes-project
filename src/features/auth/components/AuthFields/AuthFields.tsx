import Input from "../../../../shared/components/ui/Input/Input";
import type { InputChangeHandler } from "../../../../shared/components/ui/Input/Input";
import classes from "./AuthFields.module.scss";
import type { ValidationRules } from "../../../../shared/types/validation";

interface AuthFieldsProps {
  email: string;
  emailIsInvalid: boolean;
  emailValidation: ValidationRules;
  isLogin: boolean;
  isLoading: boolean;
  onEmailChange: InputChangeHandler;
  onPasswordChange: InputChangeHandler;
  password: string;
  passwordIsInvalid: boolean;
  passwordValidation: ValidationRules;
  showError: boolean;
}

const AuthFields = ({
  email,
  emailIsInvalid,
  emailValidation,
  isLogin,
  isLoading,
  onEmailChange,
  onPasswordChange,
  password,
  passwordIsInvalid,
  passwordValidation,
  showError,
}: AuthFieldsProps) => {
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
        autoComplete="email"
        label="Email"
        value={email}
        validation={emailValidation}
        showError={showError}
        disabled={isLoading}
        className={emailClassName}
        onChange={onEmailChange}
      />
      <Input
        id="password"
        name="password"
        type="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
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
