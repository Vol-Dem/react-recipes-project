"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useState, type ReactNode } from "react";
import classes from "./Image.module.scss";

interface ImageProps extends Omit<NextImageProps, "src"> {
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
      <NextImage
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
