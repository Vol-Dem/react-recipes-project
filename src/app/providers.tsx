"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Provider, useDispatch } from "react-redux";
import { initAuth } from "../features/auth/store/authThunks";
import ErrorBoundary from "../shared/components/feedback/ErrorBoundary/ErrorBoundary";
import store from "./store";
import type { AppDispatch } from "./store";
import type { PropsWithChildren } from "react";

const AuthInitializer = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return children;
};

const AppProviders = ({ children }: PropsWithChildren) => (
  <ErrorBoundary>
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        <AuthInitializer>{children}</AuthInitializer>
      </MotionConfig>
    </Provider>
  </ErrorBoundary>
);

export default AppProviders;
