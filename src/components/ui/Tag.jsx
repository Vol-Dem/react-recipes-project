import classes from "./Tag.module.scss";

const Tag = ({ children, tagCfg: { dataQuery, dataType, onTagClick } }) => {
  return (
    <span
      data-query={dataQuery}
      data-type={dataType}
      className={classes.tag}
      onClick={onTagClick}
    >
      {children}
    </span>
  );
};

export default Tag;
