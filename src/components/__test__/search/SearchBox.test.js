import { fireEvent, render, screen } from "@testing-library/react";
import SearchBox from "../../search/SearchBox";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

describe("SearchBox component", () => {
  test("renders search field", () => {
    render(<SearchBox />);
    const imputEl = screen.getByPlaceholderText(
      "WHAT RECIPE DO YOU WANT TO FIND?"
    );
    expect(imputEl).toBeInTheDocument();
  });

  test("renders filter when filter button pressed", () => {
    render(<SearchBox />);
    const filterBtn = screen.getByTestId("filter-btn");
    userEvent.click(filterBtn);
    const filter = screen.getByText("Cuisine");
    expect(filter).toBeInTheDocument();
  });

  test("search input should change", () => {
    render(<SearchBox />);
    const searchInputEl = screen.getByTestId("search-input");
    const testValue = "pizza";

    fireEvent.change(searchInputEl, { target: { value: testValue } });
    expect(searchInputEl.value).toBe(testValue);
  });
});
