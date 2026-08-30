import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import ErrorFallback from "../../shared/components/feedback/ErrorFallback/ErrorFallback";
import { usePageSetup } from "../../shared/hooks/usePageSetup";
import {
  getErrorPresentation,
  reportError,
} from "../../shared/utils/errorPresentation";

const ErrorPage = ({ title }) => {
  const error = useRouteError();
  usePageSetup(title);
  const errorPresentation = getErrorPresentation(error);

  useEffect(() => {
    reportError(error, { source: "router" });
  }, [error]);

  return <ErrorFallback {...errorPresentation} />;
};

export default ErrorPage;
