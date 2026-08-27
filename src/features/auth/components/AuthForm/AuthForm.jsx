import { useState } from "react";
import classes from "./AuthForm.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  authActions,
  authRequest,
  authWithGoogle,
  resetUserPassword,
} from "../../store/authSlice";
import Button from "../../../../shared/components/ui/Button/Button";
import { useEffect } from "react";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
  MESSAGE_AGREEMENT,
  ERROR_MESSAGE_OFFLINE,
  ERROR_MESSAGE_INVALID_INPUT,
  VALIDATION_EMAIL_MAX_LENGTH,
  VALIDATION_PASSWORD_MAX_LENGTH,
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

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState({
    value: "",
    isValid: false,
  });
  const [password, setPassword] = useState({
    value: "",
    isValid: false,
  });
  const [agreement, setAgreement] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const errorMessageAuth = useSelector((state) => state.auth.errorMessage);
  const successMessage = useSelector((state) => state.auth.successMessage);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const showResetPassword = useSelector(
    (state) => state.auth.showResetPassword,
  );
  const dispatch = useDispatch();
  const emailIsInvalid = showErrorMessage && !email.isValid;
  const passwordIsInvalid = showErrorMessage && !password.isValid;
  const resetEmailValidation = {
    required: true,
    email: true,
    maxLength: VALIDATION_EMAIL_MAX_LENGTH,
  };
  const emailValidation = {
    ...resetEmailValidation,
    disableErrorOnBlur: isLogin,
  };
  const passwordValidation = {
    required: true,
    password: true,
    maxLength: VALIDATION_PASSWORD_MAX_LENGTH,
    disableErrorOnBlur: isLogin,
  };
  useEffect(() => {
    return () => {
      dispatch(authActions.setErrorMessage(""));
      dispatch(authActions.setSuccessMessage(""));
      dispatch(authActions.setShowResetPassword(false));
    };
  }, [dispatch]);

  const authHandler = async (e) => {
    e.preventDefault();
    dispatch(authActions.setErrorMessage(""));
    dispatch(authActions.setSuccessMessage(""));
    setShowErrorMessage(true);
    if (!navigator?.onLine) {
      dispatch(authActions.setErrorMessage(ERROR_MESSAGE_OFFLINE));
      return;
    }

    if (!agreement && !isLogin) {
      dispatch(authActions.setErrorMessage(MESSAGE_AGREEMENT));
      return;
    }

    if (email.isValid && password.isValid) {
      dispatch(authRequest(isLogin, email.value, password.value));
    } else {
      dispatch(authActions.setErrorMessage(ERROR_MESSAGE_INVALID_INPUT));
    }

  };

  const switchSignType = () => {
    dispatch(authActions.setErrorMessage(""));
    dispatch(authActions.setSuccessMessage(""));
    dispatch(authActions.setShowResetPassword(false));
    setIsLogin((state) => !state);
    setEmail({
      value: "",
      isValid: false,
    });
    setPassword({
      value: "",
      isValid: false,
    });
    setShowErrorMessage(false);
  };

  const agreementHandler = () => {
    setAgreement((prevState) => !prevState);
  };

  const emailChangeHandler = (event, isValid) => {
    setEmail({ value: event.target.value, isValid });
  };

  const passwordChangeHandler = (event, isValid) => {
    setPassword({ value: event.target.value, isValid });
  };

  const googleAuthHandler = () => {
    dispatch(authWithGoogle());
  };

  const showResetPasswordHandler = () => {
    dispatch(authActions.setErrorMessage(""));
    dispatch(authActions.setSuccessMessage(""));
    dispatch(authActions.setShowResetPassword(true));
  };

  const resetPassHandler = (e) => {
    e.preventDefault();
    dispatch(resetUserPassword(email.value));
  };

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
          errorMessage={errorMessageAuth}
          isLoading={isLoading}
          showError={showErrorMessage}
          successMessage={successMessage}
          validation={resetEmailValidation}
          onEmailChange={emailChangeHandler}
          onSubmit={resetPassHandler}
        />
      )}
      {!showResetPassword && (
        <form className={classes["auth__form"]} onSubmit={authHandler}>
          {isLogin && (
            <Button
              type="button"
              onClick={googleAuthHandler}
            >
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
            showError={showErrorMessage}
            onEmailChange={emailChangeHandler}
            onPasswordChange={passwordChangeHandler}
          />

          {!isLogin && (
            <AuthAgreement
              checked={agreement}
              onChange={agreementHandler}
            />
          )}
          {isLogin && (
            <div className={classes["reset"]}>
              <LinkA
                onClick={showResetPasswordHandler}
              >
                Forgot your password?
              </LinkA>
            </div>
          )}
          <AuthMessages errorMessage={errorMessageAuth} />
          <AuthControls
            isLoading={isLoading}
            isLogin={isLogin}
            onSwitch={switchSignType}
          />
        </form>
      )}
      {isLogin && <AuthLegalNotice />}
    </motion.div>
  );
};

export default AuthForm;
