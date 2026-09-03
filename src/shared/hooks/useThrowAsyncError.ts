import { useCallback } from "react";
import { useState } from "react";

export const useThrowAsyncError = () => {
  const [errorState, setErrorState] = useState(); // eslint-disable-line

  return useCallback((error: unknown) => {
    setErrorState(() => {
      throw error;
    });
  }, []);
};
