import classes from "./Tag.module.css";

const Tag = (props) => {
  return (
    <span className={classes.tag} onClick={props.onTagClick}>
      {props.children}
    </span>
  );
};

export default Tag;
