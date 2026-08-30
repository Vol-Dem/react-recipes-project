import { Component } from "react";
import { getErrorPresentation, reportError } from "../../../utils/errorPresentation";
import ErrorFallback from "../ErrorFallback/ErrorFallback";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
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
