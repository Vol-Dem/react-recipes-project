import classes from "./AuthForm.module.scss";
import Button from "../../../../shared/components/ui/Button/Button";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
  GOOGLE_AUTH_ICON_URL,
} from "../../../../shared/constants";
import LinkA from "../../../../shared/components/ui/LinkA/LinkA";
import { motion } from "framer-motion";
import AuthAgreement from "../AuthAgreement/AuthAgreement";
import AuthControls from "../AuthControls/AuthControls";
import AuthFields from "../AuthFields/AuthFields";
import AuthLegalNotice from "../AuthLegalNotice/AuthLegalNotice";
import AuthMessages from "../AuthMessages/AuthMessages";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";
import { useAuthForm } from "../../hooks/useAuthForm";

const AuthForm = () => {
  const {
    agreement,
    changeAgreement,
    changeEmail,
    changePassword,
    email,
    emailIsInvalid,
    emailValidation,
    errorMessage,
    isLoading,
    isLogin,
    openResetPassword,
    password,
    passwordIsInvalid,
    passwordValidation,
    resetEmailValidation,
    showErrors,
    showResetPassword,
    signInWithGoogle,
    submitAuth,
    submitPasswordReset,
    successMessage,
    switchAuthMode,
  } = useAuthForm();

  return (
    <motion.div
      key={isLogin}
      className={classes.auth}
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
      exit={ANIMATION_SLIDE_IN_INITIAL}
    >
      {!showResetPassword && (
        <h3 className={classes["auth__title"]}>
          {isLogin ? "Log in" : "Sign Up"}
        </h3>
      )}
      {showResetPassword && (
        <ResetPasswordForm
          email={email.value}
          emailIsInvalid={emailIsInvalid}
          errorMessage={errorMessage}
          isLoading={isLoading}
          showError={showErrors}
          successMessage={successMessage}
          validation={resetEmailValidation}
          onEmailChange={changeEmail}
          onSubmit={submitPasswordReset}
        />
      )}
      {!showResetPassword && (
        <form className={classes["auth__form"]} onSubmit={submitAuth}>
          {isLogin && (
            <Button type="button" onClick={signInWithGoogle}>
              <img
                src={GOOGLE_AUTH_ICON_URL}
                alt="google-icon"
                className={classes["icon"]}
              ></img>{" "}
              Sign in with Google
            </Button>
          )}
          <AuthFields
            email={email.value}
            emailIsInvalid={emailIsInvalid}
            emailValidation={emailValidation}
            isLoading={isLoading}
            password={password.value}
            passwordIsInvalid={passwordIsInvalid}
            passwordValidation={passwordValidation}
            showError={showErrors}
            onEmailChange={changeEmail}
            onPasswordChange={changePassword}
          />

          {!isLogin && (
            <AuthAgreement checked={agreement} onChange={changeAgreement} />
          )}
          {isLogin && (
            <div className={classes["reset"]}>
              <LinkA onClick={openResetPassword}>
                Forgot your password?
              </LinkA>
            </div>
          )}
          <AuthMessages errorMessage={errorMessage} />
          <AuthControls
            isLoading={isLoading}
            isLogin={isLogin}
            onSwitch={switchAuthMode}
          />
        </form>
      )}
      {isLogin && <AuthLegalNotice />}
    </motion.div>
  );
};

export default AuthForm;
