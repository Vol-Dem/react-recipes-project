import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

const ModalHarness = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open dialog
      </button>
      {isOpen && (
        <Modal title="Test dialog" onClose={() => setIsOpen(false)}>
          <button type="button">First action</button>
          <button type="button">Last action</button>
        </Modal>
      )}
    </>
  );
};

describe("Modal", () => {
  it("moves focus inside, contains it, and restores it after Escape", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const opener = screen.getByRole("button", { name: "Open dialog" });
    await user.click(opener);

    const dialog = screen.getByRole("dialog", { name: "Test dialog" });
    const firstAction = screen.getByRole("button", { name: "First action" });
    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    expect(dialog).toBeInTheDocument();
    expect(firstAction).toHaveFocus();

    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
