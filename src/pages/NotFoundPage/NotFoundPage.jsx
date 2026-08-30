import ErrorFallback from "../../shared/components/feedback/ErrorFallback/ErrorFallback";
import { usePageSetup } from "../../shared/hooks/usePageSetup";
import { getErrorPresentation } from "../../shared/utils/errorPresentation";

const NotFoundPage = ({ title }) => {
  usePageSetup(title);

  return (
    <ErrorFallback
      {...getErrorPresentation({ status: 404 })}
      showReloadButton={false}
    />
  );
};

export default NotFoundPage;
