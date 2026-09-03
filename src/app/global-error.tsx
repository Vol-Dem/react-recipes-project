"use client";

import { useEffect } from "react";
import ErrorFallback from "../shared/components/feedback/ErrorFallback/ErrorFallback";
import {
  getErrorPresentation,
  reportError,
} from "../shared/utils/errorPresentation";

interface GlobalErrorProps {
  error: Error & { digest?: string; status?: number };
}

const GlobalError = ({ error }: GlobalErrorProps) => {
  useEffect(() => {
    reportError(error, { source: "next-root" });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorFallback {...getErrorPresentation(error)} />
      </body>
    </html>
  );
};

export default GlobalError;
