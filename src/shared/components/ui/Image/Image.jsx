import { useState } from "react";
import classes from "./Image.module.scss";

const Image = ({
  alt,
  className,
  fallback,
  onLoad,
  src,
  ...imageProps
}) => {
  const [loadedSource, setLoadedSource] = useState(null);
  const isLoading = loadedSource !== src;
  const imageClassName = `${classes.image} ${
    isLoading ? classes["image--hidden"] : ""
  } ${className || ""}`;

  const handleLoad = (event) => {
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
