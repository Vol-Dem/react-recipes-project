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

  it("avoids smooth scrolling when reduced motion is preferred", async () => {
    const user = userEvent.setup();
    const originalMatchMedia = window.matchMedia;
    vi.mocked(window.scrollTo).mockClear();
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(
      <>
        <header id="header"></header>
        <LinkA href="#section" smoothScroll>
          Jump to section
        </LinkA>
        <div id="section">Section</div>
      </>,
    );

    await user.click(screen.getByRole("link", { name: "Jump to section" }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: -10,
      behavior: "auto",
    });

    window.matchMedia = originalMatchMedia;
  });
});
