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
import { useAuthFormController } from "../../hooks/useAuthFormController";

const AuthForm = () => {
  const { actions, fields, mode, status, validation } =
    useAuthFormController();

  return (
    <motion.div
      key={mode.isLogin}
      className={classes.auth}
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
      exit={ANIMATION_SLIDE_IN_INITIAL}
    >
      {!mode.showResetPassword && (
        <h3 className={classes["auth__title"]}>
          {mode.isLogin ? "Log in" : "Sign Up"}
        </h3>
      )}
      {mode.showResetPassword && (
        <ResetPasswordForm
          email={fields.email.value}
          emailIsInvalid={fields.emailIsInvalid}
          errorMessage={status.errorMessage}
          isLoading={status.isLoading}
          showError={mode.showErrors}
          successMessage={status.successMessage}
          validation={validation.resetEmail}
          onEmailChange={actions.changeEmail}
          onSubmit={actions.submitPasswordReset}
        />
      )}
      {!mode.showResetPassword && (
        <form
          className={classes["auth__form"]}
          onSubmit={actions.submitAuth}
        >
          {mode.isLogin && (
            <Button type="button" onClick={actions.signInWithGoogle}>
              <img
                src={GOOGLE_AUTH_ICON_URL}
                alt="google-icon"
                className={classes["icon"]}
              ></img>{" "}
              Sign in with Google
            </Button>
          )}
          <AuthFields
            email={fields.email.value}
            emailIsInvalid={fields.emailIsInvalid}
            emailValidation={validation.email}
            isLoading={status.isLoading}
            password={fields.password.value}
            passwordIsInvalid={fields.passwordIsInvalid}
            passwordValidation={validation.password}
            showError={mode.showErrors}
            onEmailChange={actions.changeEmail}
            onPasswordChange={actions.changePassword}
          />

          {!mode.isLogin && (
            <AuthAgreement
              checked={fields.agreement}
              onChange={actions.changeAgreement}
            />
          )}
          {mode.isLogin && (
            <div className={classes["reset"]}>
              <LinkA onClick={actions.openResetPassword}>
                Forgot your password?
              </LinkA>
            </div>
          )}
          <AuthMessages errorMessage={status.errorMessage} />
          <AuthControls
            isLoading={status.isLoading}
            isLogin={mode.isLogin}
            onSwitch={actions.switchAuthMode}
          />
        </form>
      )}
      {mode.isLogin && <AuthLegalNotice />}
    </motion.div>
  );
};

export default AuthForm;
