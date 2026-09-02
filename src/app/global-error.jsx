"use client";

import { useEffect } from "react";
import ErrorFallback from "../shared/components/feedback/ErrorFallback/ErrorFallback";
import {
  getErrorPresentation,
  reportError,
} from "../shared/utils/errorPresentation";

const GlobalError = ({ error }) => {
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
