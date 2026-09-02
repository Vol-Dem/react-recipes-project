import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthAgreement from "./AuthAgreement";

describe("AuthAgreement", () => {
  it("keeps legal links separate from the checkbox activation target", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<AuthAgreement checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole("checkbox", {
      name: "I have read and agree to the Terms of Service and Privacy Policy",
    });

    await user.click(screen.getByRole("link", { name: "Terms of Service" }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledOnce();
  });
});
