import { useState } from "react";

export const useThrowAsyncError = () => {
  const [errorState, setErrorState] = useState();

  return (error) => {
    setErrorState(() => {
      throw error;
    });
  };
};
