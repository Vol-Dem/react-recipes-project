import { fireEvent, render, screen } from "@testing-library/react";
import SearchBox from "./SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox component", () => {
  test("renders search field", () => {
    render(<SearchBox />);
    const inputElement = screen.getByRole("textbox", {
      name: "Search recipes",
    });
    expect(inputElement).toBeInTheDocument();
  });

  test("renders filter when filter button pressed", async () => {
    render(<SearchBox />);
    const filterBtn = screen.getByTestId("filter-btn");
    const user = userEvent.setup();
    expect(filterBtn).toHaveAttribute("aria-expanded", "false");
    await user.click(filterBtn);
    const filter = screen.getByText("Cuisine");
    expect(filter).toBeInTheDocument();
    expect(filterBtn).toHaveAttribute("aria-expanded", "true");
  });

  test("search input should change", () => {
    render(<SearchBox />);
    const searchInputEl = screen.getByTestId("search-input");
    const testValue = "pizza";

    fireEvent.change(searchInputEl, { target: { value: testValue } });
    expect(searchInputEl.value).toBe(testValue);
  });
});
