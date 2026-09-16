import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import Select from "./Select";

const options = [
  { value: "default", label: "Default" },
  { value: "calories", label: "Calories" },
  { value: "time", label: "Time" },
];
const Example = () => {
  const [value, setValue] = useState("default");
  return (
    <>
      <Select
        label="Sort by"
        name="sort"
        options={options}
        value={value}
        onChange={setValue}
      />
      <button>Outside</button>
    </>
  );
};

describe("Select", () => {
  test("selects by pointer and preserves focus on the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox", { name: "Sort by" });
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Calories" }));
    expect(trigger).toHaveTextContent("Calories");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("supports keyboard preview, Escape, typeahead, and Tab", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox");
    await user.tab();
    await user.keyboard("{ArrowDown}{End}{Escape}");
    expect(trigger).toHaveTextContent("Default");
    await user.keyboard("c{Enter}");
    expect(trigger).toHaveTextContent("Calories");
    await user.keyboard("{ArrowDown}{End}");
    await user.tab();
    expect(trigger).toHaveTextContent("Time");
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  test("dismisses on outside click without changing the value", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.keyboard("{End}");
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Default");
  });

  test("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Sort"
        options={options}
        value="default"
        onChange={vi.fn()}
        disabled
      />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
