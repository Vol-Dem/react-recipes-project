import ErrorFallback from "../shared/components/feedback/ErrorFallback/ErrorFallback";
import { getErrorPresentation } from "../shared/utils/errorPresentation";

const NotFound = () => (
  <ErrorFallback
    {...getErrorPresentation({ status: 404 })}
    showReloadButton={false}
  />
);

export default NotFound;
