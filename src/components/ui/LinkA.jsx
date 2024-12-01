import classes from "./LinkA.module.scss";

const LinkA = (props) => {
  const smoothScroll = (e) => {
    e.preventDefault();

    const scrollTarget = document.querySelector(props.href);
    const headerHeight = document.querySelector("#header").offsetHeight;
    const distToTop = window.scrollY + scrollTarget.getBoundingClientRect().top;
    window.scrollTo({ top: distToTop - headerHeight - 10, behavior: "smooth" });
  };

  return (
    <a
      className={`${classes.link} ${props.className || ""}`}
      target={props.external ? "_blank" : ""}
      rel="noreferrer nofollow"
      href={props.href}
      onClick={(e) => {
        if (props?.onClick) {
          props.onClick(e);
        }
        if (props?.smoothScroll) {
          smoothScroll(e);
        }
      }}
    >
      {props.children}
      {props.external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      )}
    </a>
  );
};

export default LinkA;
