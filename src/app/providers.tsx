"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Provider, useDispatch } from "react-redux";
import { initAuth } from "../features/auth/store/authThunks";
import ErrorBoundary from "../shared/components/feedback/ErrorBoundary/ErrorBoundary";
import { makeStore } from "./store";
import { makeQueryClient } from "./queryClient";
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

const AppProviders = ({ children }: PropsWithChildren) => {
  const [store] = useState(makeStore);
  const [queryClient] = useState(makeQueryClient);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MotionConfig reducedMotion="user">
            <AuthInitializer>{children}</AuthInitializer>
          </MotionConfig>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default AppProviders;
