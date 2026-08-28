import { fireEvent, render, screen } from "@testing-library/react";
import Image from "./Image";

describe("Image", () => {
  it("shows its fallback until the image loads", () => {
    const onLoad = vi.fn();

    render(
      <Image
        src="image.jpg"
        alt="Recipe"
        fallback={<span>Loading image</span>}
        onLoad={onLoad}
      />,
    );

    expect(screen.getByText("Loading image")).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { name: "Recipe" }));

    expect(screen.queryByText("Loading image")).not.toBeInTheDocument();
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("shows its fallback again when the source changes", () => {
    const { rerender } = render(
      <Image
        src="image-one.jpg"
        alt="Recipe"
        fallback={<span>Loading image</span>}
      />,
    );
    fireEvent.load(screen.getByRole("img", { name: "Recipe" }));

    rerender(
      <Image
        src="image-two.jpg"
        alt="Recipe"
        fallback={<span>Loading image</span>}
      />,
    );

    expect(screen.getByText("Loading image")).toBeInTheDocument();
  });
});
