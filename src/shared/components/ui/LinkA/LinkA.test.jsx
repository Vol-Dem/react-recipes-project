import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkA from "./LinkA";

describe("LinkA", () => {
  it("renders an action without a destination as a keyboard-operable button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<LinkA onClick={onClick}>Forgot your password?</LinkA>);

    const action = screen.getByRole("button", {
      name: "Forgot your password?",
    });

    action.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
  });
});
