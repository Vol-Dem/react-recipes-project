import { useEffect, useState } from "react";
import classes from "./Image.module.scss";

const Image = ({
  alt,
  className,
  fallback,
  onLoad,
  src,
  ...imageProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageClassName = `${classes.image} ${
    isLoading ? classes["image--hidden"] : ""
  } ${className || ""}`;

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const handleLoad = (event) => {
    setIsLoading(false);
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
