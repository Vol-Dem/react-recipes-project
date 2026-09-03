import { fireEvent, render, screen } from "@testing-library/react";
import Ingredients from "./Ingredients";

const ingredients = [
  {
    id: 1,
    amount: 1.5,
    name: "extra virgin olive oil",
    unit: "tbsp",
  },
  { id: 2, amount: 2, name: "eggs", unit: "" },
];

describe("Ingredients", () => {
  it("reveals a complete long name on focus and allows it to be pinned", () => {
    render(<Ingredients ingredients={ingredients} />);

    const nameButton = screen.getByRole("button", {
      name: "Full ingredient name: extra virgin olive oil",
    });

    expect(nameButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.focus(nameButton);
    expect(nameButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.blur(nameButton);
    expect(nameButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(nameButton);
    expect(nameButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(nameButton);
    expect(nameButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders short names as plain text", () => {
    render(<Ingredients ingredients={ingredients} />);

    expect(screen.getByText("eggs")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
