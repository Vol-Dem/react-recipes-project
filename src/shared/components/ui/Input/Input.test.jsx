import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("associates a displayed validation error with the input", () => {
    render(
      <Input
        label="Email"
        value=""
        validation={{ required: true }}
        showError
        onChange={() => {}}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveTextContent("This field is required");
  });
});
