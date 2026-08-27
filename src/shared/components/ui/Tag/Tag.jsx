import classes from "./Tag.module.scss";

const Tag = ({ children, query, type, onClick }) => {
  return (
    <button
      type="button"
      data-query={query}
      data-type={type}
      className={classes.tag}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Tag;
