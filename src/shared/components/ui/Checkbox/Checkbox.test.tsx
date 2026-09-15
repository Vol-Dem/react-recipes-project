import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  test("generates distinct IDs and toggles only the associated checkbox", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox name="diet" value="vegan" label="Vegan" />
        <Checkbox name="diet" value="vegetarian" label="Vegetarian" />
      </>,
    );

    const vegan = screen.getByRole("checkbox", { name: "Vegan" });
    const vegetarian = screen.getByRole("checkbox", { name: "Vegetarian" });
    expect(vegan.id).toBeTruthy();
    expect(vegan.id).not.toBe(vegetarian.id);
    await user.click(screen.getByText("Vegan"));
    expect(vegan).toBeChecked();
    expect(vegetarian).not.toBeChecked();
  });

  test("preserves an explicit ID and disabled behavior", async () => {
    const user = userEvent.setup();
    render(<Checkbox id="agreement" label="Agreement" disabled />);

    const checkbox = screen.getByLabelText("Agreement");
    expect(checkbox).toHaveAttribute("id", "agreement");
    await user.click(screen.getByText("Agreement"));
    expect(checkbox).not.toBeChecked();
  });
});
