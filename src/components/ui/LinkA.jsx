import classes from "./LinkA.module.scss";
import ExternalLinkIcon from "../../assets/ExternalLinkIcon";

const LinkA = ({
  children,
  className,
  external,
  href,
  onClick,
  smoothScroll: shouldSmoothScroll,
}) => {
  const smoothScroll = (e) => {
    e.preventDefault();

    const scrollTarget = document.querySelector(href);
    const headerHeight = document.querySelector("#header").offsetHeight;
    const distToTop = window.scrollY + scrollTarget.getBoundingClientRect().top;
    window.scrollTo({ top: distToTop - headerHeight - 10, behavior: "smooth" });
  };

  const clickHandler = (event) => {
    onClick?.(event);

    if (shouldSmoothScroll) {
      smoothScroll(event);
    }
  };

  return (
    <a
      className={`${classes.link} ${className || ""}`}
      target={external ? "_blank" : ""}
      rel="noreferrer nofollow"
      href={href}
      onClick={clickHandler}
    >
      {children}
      {external && <ExternalLinkIcon />}
    </a>
  );
};

export default LinkA;
