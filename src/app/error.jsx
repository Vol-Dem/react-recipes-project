"use client";

import { useEffect } from "react";
import ErrorFallback from "../shared/components/feedback/ErrorFallback/ErrorFallback";
import {
  getErrorPresentation,
  reportError,
} from "../shared/utils/errorPresentation";

const ErrorPage = ({ error }) => {
  useEffect(() => {
    reportError(error, { source: "next-router" });
  }, [error]);

  return <ErrorFallback {...getErrorPresentation(error)} />;
};

export default ErrorPage;
