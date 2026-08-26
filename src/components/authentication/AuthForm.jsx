import { useState } from "react";
import Input from "../ui/Input";
import classes from "./AuthForm.module.scss";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  authActions,
  authRequest,
  authWithGoogle,
  resetUserPassword,
} from "../../store/auth";
import Button from "../ui/Button";
import { useEffect } from "react";
import ButtonSecondary from "../ui/ButtonSecondary";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
  MESSAGE_AGREEMENT,
  ERROR_MESSAGE_OFFLINE,
  ERROR_MESSAGE_INVALID_INPUT,
  VALIDATION_EMAIL_MAX_LENGTH,
  VALIDATION_PASSWORD_MAX_LENGTH,
  GOOGLE_AUTH_ICON_URL,
} from "../../constants";
import Checkbox from "../ui/Checkbox";
import LinkA from "../ui/LinkA";
import SuccessMessage from "../ui/SuccessMessage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  const emailClassName = `${classes["auth__input"]} ${
    emailIsInvalid ? classes.invalid : ""
  }`;
  const passwordClassName = `${classes["auth__input"]} ${
    passwordIsInvalid ? classes.invalid : ""
  }`;
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
  const agreementLabel = (
    <span>
      I have read and agree to the{" "}
      <Link className={classes.link} to="tos" target="blank">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link className={classes.link} to="privacy" target="blank">
        Privacy Policy
      </Link>
    </span>
  );

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

  const resetPasswordForm = (
    <form onSubmit={resetPassHandler} className={classes["auth__form"]}>
      <Input
        label="Email"
        name="email"
        type="email"
        disabled={isLoading}
        className={emailClassName}
        autoFocus={true}
        onChange={emailChangeHandler}
        validation={resetEmailValidation}
        showError={showErrorMessage}
        value={email.value}
      />
      {errorMessageAuth && (
        <ErrorMessage className={classes["auth__error"]}>
          {errorMessageAuth}
        </ErrorMessage>
      )}
      {successMessage && (
        <SuccessMessage className={classes["auth__error"]}>
          {successMessage}
        </SuccessMessage>
      )}
      <Button>Reset password</Button>
    </form>
  );

  return (
    <motion.div
      key={isLogin}
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
      exit={ANIMATION_SLIDE_IN_INITIAL}
      className={classes.auth}
    >
      {!showResetPassword && (
        <h3 className={classes["auth__title"]}>
          {isLogin ? "Log in" : "Sign Up"}
        </h3>
      )}
      {showResetPassword && resetPasswordForm}
      {!showResetPassword && (
        <form onSubmit={authHandler} className={classes["auth__form"]}>
          {isLogin && (
            <Button
              type="button"
              onClick={googleAuthHandler}
            >
              <img
                className={classes["icon"]}
                alt="google-icon"
                src={GOOGLE_AUTH_ICON_URL}
              ></img>{" "}
              Sign in with Google
            </Button>
          )}
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            disabled={isLoading}
            className={emailClassName}
            autoFocus={true}
            onChange={emailChangeHandler}
            validation={emailValidation}
            showError={showErrorMessage}
            value={email.value}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            disabled={isLoading}
            className={passwordClassName}
            onChange={passwordChangeHandler}
            validation={passwordValidation}
            showError={showErrorMessage}
            value={password.value}
          />

          {!isLogin && (
            <Checkbox
              id="agreement"
              name="agreement"
              checked={agreement}
              label={agreementLabel}
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
          {errorMessageAuth && (
            <ErrorMessage className={classes["auth__error"]}>
              {errorMessageAuth}
            </ErrorMessage>
          )}
          <div className={classes["auth__controls"]}>
            <ButtonSecondary
              type="button"
              onClick={switchSignType}
              disabled={isLoading}
              className={classes["auth__btn--switch"]}
            >
              {isLogin ? "Create Account" : "Log in"}
            </ButtonSecondary>
            <Button
              disabled={isLoading}
              className={classes["auth__btn--submit"]}
            >
              {isLoading && <Spinner size="small" />}
              <span>{isLogin ? "Log in" : "Sign up"}</span>
            </Button>
          </div>
        </form>
      )}
      {isLogin && (
        <div className={classes["privacy"]}>
          By continuing, you are indicating that you accept our
          <Link className={classes.link} to="tos" target="blank">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className={classes.link} to="privacy" target="blank">
            Privacy Policy
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AuthForm;
