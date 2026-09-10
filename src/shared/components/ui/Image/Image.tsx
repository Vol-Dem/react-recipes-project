"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useState, type ReactNode } from "react";
import classes from "./Image.module.scss";

interface ImageProps extends Omit<NextImageProps, "src"> {
  fallback?: ReactNode;
  src?: string | null;
}

/**
 * Wraps next/image with a source-specific reveal transition and decorative fallback.
 * Missing or blank URLs render no image element; loading a valid source removes
 * the fallback. Loaded-source tracking survives list reordering and size changes.
 * The parent supplies image dimensions/sizes and a positioned fallback container.
 */
const Image = ({
  alt,
  className,
  fallback,
  onLoad,
  src,
  ...imageProps
}: ImageProps) => {
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const imageSource = src?.trim() || null;
  const isLoading = !imageSource || loadedSource !== imageSource;
  const imageClassName = `${classes.image} ${
    isLoading ? classes["image--hidden"] : ""
  } ${className || ""}`;

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setLoadedSource(imageSource);
    onLoad?.(event);
  };

  return (
    <>
      {imageSource && (
        <NextImage
          {...imageProps}
          alt={alt}
          className={imageClassName}
          src={imageSource}
          onLoad={handleLoad}
        />
      )}
      {isLoading && fallback && (
        <span className={classes.fallback} aria-hidden="true">
          {fallback}
        </span>
      )}
    </>
  );
};

export default Image;
