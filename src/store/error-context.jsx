import React from "react";

const ErrorContext = React.createContext({
  errorMessage: "",
  setErrorMessage: (error) => {},
});

export default ErrorContext;
