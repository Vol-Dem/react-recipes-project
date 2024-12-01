import { useCallback } from "react";
import { useReducer } from "react";

const defaultState = {
  inputValue: "",
  isValid: false,
  errorMessage: "",
};

const validationReducer = (state, action) => {
  if (action.type === "email") {
    const isValid = action.value.split("").includes("@");
    const errorMessage = isValid ? "" : "Email must includes @";
    return { inputValue: action.value, isValid, errorMessage };
  }
  if (action.type === "password") {
    const isValid = action.value.length >= 6;
    const errorMessage = isValid ? "" : "Password needs to be 6+ characters";
    return { inputValue: action.value, isValid, errorMessage };
  }
  return state;
};

/**
 * Validate input data
 * @param {string} type - Type of validation (email or password)
 * @returns {Array} - Returns array with a state object {inputValue,isValid,errorMessage}, and a function to pass value.
 */
export const useValidation = (type) => {
  const [state, dispatch] = useReducer(validationReducer, defaultState);

  const validate = useCallback(
    (value) => {
      dispatch({ type: type, value: value });
    },
    [dispatch, type]
  );

  return [state, validate];
};
