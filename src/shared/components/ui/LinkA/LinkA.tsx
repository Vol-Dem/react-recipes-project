import classes from "./LinkA.module.scss";
import ExternalLinkIcon from "../../../../assets/icons/ExternalLinkIcon";
import type { MouseEvent, MouseEventHandler, PropsWithChildren } from "react";

interface LinkAProps extends PropsWithChildren {
  className?: string;
  external?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  smoothScroll?: boolean;
}

const LinkA = ({
  children,
  className,
  external,
  href,
  onClick,
  smoothScroll: shouldSmoothScroll,
}: LinkAProps) => {
  const smoothScroll = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (!href) return;

    const scrollTarget = document.querySelector<HTMLElement>(href);
    const header = document.querySelector<HTMLElement>("#header");

    if (!scrollTarget || !header) return;

    const headerHeight = header.offsetHeight;
    const distToTop = window.scrollY + scrollTarget.getBoundingClientRect().top;
    const reducedMotionIsPreferred = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: distToTop - headerHeight - 10,
      behavior: reducedMotionIsPreferred ? "auto" : "smooth",
    });
  };

  const clickHandler = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    onClick?.(event);

    if (shouldSmoothScroll) {
      smoothScroll(event);
    }
  };

  if (!href) {
    return (
      <button
        type="button"
        className={`${classes.link} ${className || ""}`}
        onClick={clickHandler}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      className={`${classes.link} ${className || ""}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer nofollow" : undefined}
      href={href}
      onClick={clickHandler}
    >
      {children}
      {external && <ExternalLinkIcon />}
    </a>
  );
};

export default LinkA;
