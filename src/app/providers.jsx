"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Provider, useDispatch } from "react-redux";
import { initAuth } from "../features/auth/store/authThunks";
import ErrorBoundary from "../shared/components/feedback/ErrorBoundary/ErrorBoundary";
import store from "./store";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return children;
};

const AppProviders = ({ children }) => (
  <ErrorBoundary>
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        <AuthInitializer>{children}</AuthInitializer>
      </MotionConfig>
    </Provider>
  </ErrorBoundary>
);

export default AppProviders;
