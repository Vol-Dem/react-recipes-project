import classes from "./Header.module.scss";

const Header = (props) => {
  return <header className={classes.header}>{props.children}</header>;
};

export default Header;
