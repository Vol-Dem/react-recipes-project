import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Image from "./Image";
import classes from "./Image.module.scss";

describe("Image", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows its fallback until the image loads", async () => {
    const onLoad = vi.fn();

    render(
      <Image
        src="/image.jpg"
        width={312}
        height={231}
        alt="Recipe"
        fallback={<span>Loading image</span>}
        onLoad={onLoad}
      />,
    );

    expect(screen.getByText("Loading image")).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { name: "Recipe" }));

    await waitFor(() =>
      expect(screen.queryByText("Loading image")).not.toBeInTheDocument(),
    );
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("tracks loading independently for each source", async () => {
    const { rerender } = render(
      <Image
        src="/image-one.jpg"
        width={312}
        height={231}
        alt="Recipe"
        fallback={<span>Loading image</span>}
      />,
    );
    fireEvent.load(screen.getByRole("img", { name: "Recipe" }));
    await waitFor(() =>
      expect(screen.queryByText("Loading image")).not.toBeInTheDocument(),
    );

    rerender(
      <Image
        src="/image-two.jpg"
        width={312}
        height={231}
        alt="Recipe"
        fallback={<span>Loading image</span>}
      />,
    );

    expect(screen.getByText("Loading image")).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { name: "Recipe" }));

    await waitFor(() =>
      expect(screen.queryByText("Loading image")).not.toBeInTheDocument(),
    );
  });

  it("reveals an image that was already loaded before mounting", async () => {
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(
      true,
    );
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
      312,
    );

    render(
      <Image
        src="/cached.jpg"
        alt="Cached recipe"
        width={312}
        height={231}
        fallback={<span>Loading image</span>}
      />,
    );

    await waitFor(() =>
      expect(screen.queryByText("Loading image")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("img")).not.toHaveClass(classes["image--hidden"]);
  });

  it("keeps loaded images visible after sorting and changing responsive sizes", async () => {
    const renderImages = (ids: number[], sizes: string) =>
      ids.map((id) => (
        <Image
          key={id}
          src={`/recipe-${id}.jpg`}
          alt={`Recipe ${id}`}
          width={312}
          height={231}
          sizes={sizes}
          fallback={<span>Loading image</span>}
        />
      ));

    const { rerender } = render(renderImages([1, 2], "266px"));
    screen.getAllByRole("img").forEach((img) => fireEvent.load(img));
    await waitFor(() =>
      expect(screen.queryAllByText("Loading image")).toHaveLength(0),
    );

    rerender(renderImages([2, 1], "92px"));

    expect(
      screen.getAllByRole("img").map((img) => img.getAttribute("alt")),
    ).toEqual(["Recipe 2", "Recipe 1"]);
    screen.getAllByRole("img").forEach((img) => {
      expect(img).not.toHaveClass(classes["image--hidden"]);
      expect(img).toHaveAttribute("sizes", "92px");
      expect(img).toHaveAttribute("srcset");
    });
    expect(screen.queryAllByText("Loading image")).toHaveLength(0);
  });
});
