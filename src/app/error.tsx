"use client";

import { useEffect } from "react";
import ErrorFallback from "../shared/components/feedback/ErrorFallback/ErrorFallback";
import {
  getErrorPresentation,
  reportError,
} from "../shared/utils/errorPresentation";

interface ErrorPageProps {
  error: Error & { digest?: string; status?: number };
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    reportError(error, { source: "next-router" });
  }, [error]);

  return <ErrorFallback {...getErrorPresentation(error)} />;
};

export default ErrorPage;
