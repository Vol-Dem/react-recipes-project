import { Component, type ErrorInfo, type PropsWithChildren } from "react";
import {
  getErrorPresentation,
  reportError,
} from "../../../utils/errorPresentation";
import ErrorFallback from "../ErrorFallback/ErrorFallback";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback {...getErrorPresentation()} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
