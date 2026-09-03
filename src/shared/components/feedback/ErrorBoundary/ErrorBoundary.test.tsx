import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = () => {
  throw new Error("Sensitive render details");
};

describe("ErrorBoundary", () => {
  it("renders a safe fallback for render failures", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(
      screen.queryByText("Sensitive render details"),
    ).not.toBeInTheDocument();

    consoleError.mockRestore();
  });
});
