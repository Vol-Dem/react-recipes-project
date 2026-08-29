import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ERROR_MESSAGE_INVALID_INPUT,
  ERROR_MESSAGE_OFFLINE,
  MESSAGE_AGREEMENT,
} from "../../../shared/constants";
import { validateInput } from "../../../shared/utils/validation";
import { authActions } from "../store/authSlice";
import {
  authRequest,
  authWithGoogle,
  resetUserPassword,
} from "../store/authThunks";
import {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
  RESET_EMAIL_VALIDATION,
} from "../utils/authValidation";
import {
  selectAuthErrorMessage,
  selectAuthIsLoading,
  selectAuthShowResetPassword,
  selectAuthSuccessMessage,
} from "../store/authSelectors";

const initialFormState = {
  agreement: false,
  email: "",
  isLogin: true,
  password: "",
  showErrors: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "changeAgreement":
      return { ...state, agreement: !state.agreement };
    case "changeEmail":
      return { ...state, email: action.payload };
    case "changePassword":
      return { ...state, password: action.payload };
    case "showErrors":
      return { ...state, showErrors: true };
    case "switchMode":
      return {
        ...state,
        email: "",
        isLogin: !state.isLogin,
        password: "",
        showErrors: false,
      };
    default:
      return state;
  }
};

export const useAuthFormController = () => {
  const [formState, updateFormState] = useReducer(
    formReducer,
    initialFormState,
  );
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectAuthErrorMessage);
  const successMessage = useSelector(selectAuthSuccessMessage);
  const isLoading = useSelector(selectAuthIsLoading);
  const showResetPassword = useSelector(selectAuthShowResetPassword);
  const {
    agreement,
    email: emailValue,
    isLogin,
    password: passwordValue,
    showErrors,
  } = formState;
  const validationMode = isLogin ? "login" : "signup";
  const emailValidation = EMAIL_VALIDATION[validationMode];
  const passwordValidation = PASSWORD_VALIDATION[validationMode];
  const email = {
    value: emailValue,
    isValid:
      !emailValidation || validateInput(emailValidation, emailValue).isValid,
  };
  const password = {
    value: passwordValue,
    isValid:
      !passwordValidation ||
      validateInput(passwordValidation, passwordValue).isValid,
  };
  const resetEmailIsValid = validateInput(
    RESET_EMAIL_VALIDATION,
    emailValue,
  ).isValid;

  const clearMessages = () => {
    dispatch(authActions.setErrorMessage(""));
    dispatch(authActions.setSuccessMessage(""));
  };

  useEffect(
    () => () => {
      dispatch(authActions.setErrorMessage(""));
      dispatch(authActions.setSuccessMessage(""));
      dispatch(authActions.setShowResetPassword(false));
    },
    [dispatch],
  );

  const submitAuth = (event) => {
    event.preventDefault();
    clearMessages();
    updateFormState({ type: "showErrors" });

    if (!navigator?.onLine) {
      dispatch(authActions.setErrorMessage(ERROR_MESSAGE_OFFLINE));
      return;
    }

    if (!agreement && !isLogin) {
      dispatch(authActions.setErrorMessage(MESSAGE_AGREEMENT));
      return;
    }

    if (!email.isValid || !password.isValid) {
      dispatch(authActions.setErrorMessage(ERROR_MESSAGE_INVALID_INPUT));
      return;
    }

    dispatch(authRequest(isLogin, email.value, password.value));
  };

  const switchAuthMode = () => {
    clearMessages();
    dispatch(authActions.setShowResetPassword(false));
    updateFormState({ type: "switchMode" });
  };

  const changeAgreement = () => {
    updateFormState({ type: "changeAgreement" });
  };

  const changeEmail = (event) => {
    updateFormState({
      type: "changeEmail",
      payload: event.target.value,
    });
  };

  const changePassword = (event) => {
    updateFormState({
      type: "changePassword",
      payload: event.target.value,
    });
  };

  const signInWithGoogle = () => {
    dispatch(authWithGoogle());
  };

  const openResetPassword = () => {
    clearMessages();
    dispatch(authActions.setShowResetPassword(true));
  };

  const submitPasswordReset = (event) => {
    event.preventDefault();

    clearMessages();
    updateFormState({ type: "showErrors" });

    if (!resetEmailIsValid) {
      dispatch(authActions.setErrorMessage(ERROR_MESSAGE_INVALID_INPUT));
      return;
    }

    dispatch(resetUserPassword(email.value));
  };

  return {
    actions: {
      changeAgreement,
      changeEmail,
      changePassword,
      openResetPassword,
      signInWithGoogle,
      submitAuth,
      submitPasswordReset,
      switchAuthMode,
    },
    fields: {
      agreement,
      email,
      emailIsInvalid:
        showErrors &&
        !(showResetPassword ? resetEmailIsValid : email.isValid),
      password,
      passwordIsInvalid: showErrors && !password.isValid,
    },
    mode: {
      isLogin,
      showErrors,
      showResetPassword,
    },
    status: {
      errorMessage,
      isLoading,
      successMessage,
    },
    validation: {
      email: emailValidation,
      password: passwordValidation,
      resetEmail: RESET_EMAIL_VALIDATION,
    },
  };
};
