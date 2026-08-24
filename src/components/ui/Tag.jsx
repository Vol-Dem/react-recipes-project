import classes from "./Tag.module.scss";

const Tag = ({ children, tagCfg: { dataQuery, dataType, onTagClick } }) => {
  return (
    <button
      type="button"
      data-query={dataQuery}
      data-type={dataType}
      className={classes.tag}
      onClick={onTagClick}
    >
      {children}
    </button>
  );
};

export default Tag;
