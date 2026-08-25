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

  return (
    <a
      className={`${classes.link} ${className || ""}`}
      target={external ? "_blank" : ""}
      rel="noreferrer nofollow"
      href={href}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        if (shouldSmoothScroll) {
          smoothScroll(e);
        }
      }}
    >
      {children}
      {external && <ExternalLinkIcon className="w-6 h-6" />}
    </a>
  );
};

export default LinkA;
