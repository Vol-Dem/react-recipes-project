import classes from "./Tag.module.scss";

const Tag = (props) => {
  const { dataQuery, dataType, onTagClick } = props.tagCfg;
  return (
    <span
      data-query={dataQuery}
      data-type={dataType}
      className={classes.tag}
      onClick={onTagClick}
    >
      {props.children}
    </span>
  );
};

export default Tag;
