import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import classes from "./Image.module.scss";

interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "src"
> {
  alt: string;
  fallback?: ReactNode;
  src: string;
}

const Image = ({
  alt,
  className,
  fallback,
  onLoad,
  src,
  ...imageProps
}: ImageProps) => {
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const isLoading = loadedSource !== src;
  const imageClassName = `${classes.image} ${
    isLoading ? classes["image--hidden"] : ""
  } ${className || ""}`;

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setLoadedSource(src);
    onLoad?.(event);
  };

  return (
    <>
      <img
        {...imageProps}
        alt={alt}
        className={imageClassName}
        src={src}
        onLoad={handleLoad}
      />
      {isLoading && fallback && (
        <span className={classes.fallback} aria-hidden="true">
          {fallback}
        </span>
      )}
    </>
  );
};

export default Image;
