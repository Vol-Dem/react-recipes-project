import { useState } from "react";
import ErrorContext from "./error-context";

const ErrorProvider = (props) => {
  const [errorMessage, setErrorMessage] = useState();

  const setErrorMessageHandler = (error) => {
    setErrorMessage(error);
  };

  const errorContext = {
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessageHandler,
  };

  return (
    <ErrorContext.Provider value={errorContext}>
      {props.children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
