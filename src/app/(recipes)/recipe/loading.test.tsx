import { Suspense, use } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import RecipeLoading from "./loading";

const LoadedRecipe = ({ title }: { title: Promise<string> }) => {
  const resolvedTitle = use(title);
  return <title>{resolvedTitle}</title>;
};

describe("recipe route loading title", () => {
  afterEach(cleanup);

  it("sets a temporary title while retaining the recipe skeleton", () => {
    render(<RecipeLoading />);
    expect(document.title).toBe("Loading recipe | Your Recipe Book");
    expect(screen.getByTestId("recipe")).toBeInTheDocument();
  });

  it("removes the loading title when the resolved title takes over", async () => {
    let resolveTitle!: (title: string) => void;
    const title = new Promise<string>((resolve) => {
      resolveTitle = resolve;
    });
    await act(async () => {
      render(
        <Suspense fallback={<RecipeLoading />}>
          <LoadedRecipe title={title} />
        </Suspense>,
      );
    });
    expect(document.title).toBe("Loading recipe | Your Recipe Book");
    await act(async () => resolveTitle("Pasta | Your Recipe Book"));
    expect(document.title).toBe("Pasta | Your Recipe Book");
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(screen.queryByTestId("recipe")).not.toBeInTheDocument();
  });

  it("does not leave a stale title after navigating away during loading", () => {
    const { unmount } = render(<RecipeLoading />);
    unmount();
    expect(document.head.querySelector("title")).toBeNull();
  });
});
