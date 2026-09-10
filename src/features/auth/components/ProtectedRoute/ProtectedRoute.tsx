"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { PropsWithChildren } from "react";
import {
  selectAuthIsInitialized,
  selectAuthIsLoggedIn,
} from "../../store/authSelectors";

/**
 * Hides protected UI until Firebase auth initialization completes, then redirects
 * signed-out users home. This client-only guard does not authorize server requests
 * or replace Firestore security rules.
 */
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isInitialized = useSelector(selectAuthIsInitialized);
  const isLoggedIn = useSelector(selectAuthIsLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.replace("/");
    }
  }, [isInitialized, isLoggedIn, router]);

  if (!isInitialized) {
    return null;
  }

  if (!isLoggedIn) return null;

  return children;
};

export default ProtectedRoute;
