import { renderHook } from "@testing-library/react";
import { usePageSetup } from "./usePageSetup";

describe("usePageSetup", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    window.scrollTo.mockClear();
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it("sets the document title and scrolls to the top on mount", () => {
    renderHook(() => usePageSetup("Privacy Policy"));

    expect(document.title).toBe("Privacy Policy");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("updates the title without repeating the mount scroll", () => {
    const { rerender } = renderHook(({ title }) => usePageSetup(title), {
      initialProps: { title: "Privacy Policy" },
    });

    rerender({ title: "Terms of Service" });

    expect(document.title).toBe("Terms of Service");
    expect(window.scrollTo).toHaveBeenCalledOnce();
  });

  it("restores the previous title on unmount", () => {
    document.title = "Recipe Search";

    const { unmount } = renderHook(() => usePageSetup("Recipe Details"));

    unmount();

    expect(document.title).toBe("Recipe Search");
  });
});
