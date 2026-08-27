import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ERROR_MESSAGE_INVALID_INPUT,
  ERROR_MESSAGE_OFFLINE,
  MESSAGE_AGREEMENT,
} from "../../../shared/constants";
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

const emptyField = Object.freeze({ value: "", isValid: false });
const initialFormState = {
  agreement: false,
  email: emptyField,
  isLogin: true,
  password: emptyField,
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
        email: emptyField,
        isLogin: !state.isLogin,
        password: emptyField,
        showErrors: false,
      };
    default:
      return state;
  }
};

export const useAuthForm = () => {
  const [formState, updateFormState] = useReducer(
    formReducer,
    initialFormState,
  );
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const successMessage = useSelector((state) => state.auth.successMessage);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const showResetPassword = useSelector(
    (state) => state.auth.showResetPassword,
  );
  const { agreement, email, isLogin, password, showErrors } = formState;
  const validationMode = isLogin ? "login" : "signup";

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

  const changeEmail = (event, isValid) => {
    updateFormState({
      type: "changeEmail",
      payload: { value: event.target.value, isValid },
    });
  };

  const changePassword = (event, isValid) => {
    updateFormState({
      type: "changePassword",
      payload: { value: event.target.value, isValid },
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
    dispatch(resetUserPassword(email.value));
  };

  return {
    agreement,
    changeAgreement,
    changeEmail,
    changePassword,
    email,
    emailIsInvalid: showErrors && !email.isValid,
    emailValidation: EMAIL_VALIDATION[validationMode],
    errorMessage,
    isLoading,
    isLogin,
    openResetPassword,
    password,
    passwordIsInvalid: showErrors && !password.isValid,
    passwordValidation: PASSWORD_VALIDATION[validationMode],
    resetEmailValidation: RESET_EMAIL_VALIDATION,
    showErrors,
    showResetPassword,
    signInWithGoogle,
    submitAuth,
    submitPasswordReset,
    successMessage,
    switchAuthMode,
  };
};
