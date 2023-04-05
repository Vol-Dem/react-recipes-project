import { Component } from "react";
import classes from "./ErrorBoundary.module.scss";
import Card from "../ui/Card";
import ErrorMessage from "../ui/ErrorMessage";

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
      return <ErrorMessage message={this.state.errorMessage} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
