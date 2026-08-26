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
    <form className={classes["auth__form"]} onSubmit={resetPassHandler}>
      <Input
        name="email"
        type="email"
        label="Email"
        value={email.value}
        validation={resetEmailValidation}
        showError={showErrorMessage}
        disabled={isLoading}
        autoFocus={true}
        className={emailClassName}
        onChange={emailChangeHandler}
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
      {showResetPassword && resetPasswordForm}
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
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email.value}
            validation={emailValidation}
            showError={showErrorMessage}
            disabled={isLoading}
            autoFocus={true}
            className={emailClassName}
            onChange={emailChangeHandler}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password.value}
            validation={passwordValidation}
            showError={showErrorMessage}
            disabled={isLoading}
            className={passwordClassName}
            onChange={passwordChangeHandler}
          />

          {!isLogin && (
            <Checkbox
              id="agreement"
              name="agreement"
              label={agreementLabel}
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
          {errorMessageAuth && (
            <ErrorMessage className={classes["auth__error"]}>
              {errorMessageAuth}
            </ErrorMessage>
          )}
          <div className={classes["auth__controls"]}>
            <ButtonSecondary
              type="button"
              disabled={isLoading}
              className={classes["auth__btn--switch"]}
              onClick={switchSignType}
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
