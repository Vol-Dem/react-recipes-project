import classes from "./Tag.module.scss";

const Tag = (props) => {
  return (
    <span
      data-query={props.dataQuery}
      data-type={props.dataType}
      className={classes.tag}
      onClick={props.onTagClick}
    >
      {props.children}
    </span>
  );
};

export default Tag;
