import { Component } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import Card from "../ui/Card";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }
  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <ErrorMessage>{this.state.errorMessage}</ErrorMessage>
        </Card>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
