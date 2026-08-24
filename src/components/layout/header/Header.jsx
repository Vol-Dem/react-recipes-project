import classes from "./Header.module.scss";

const Header = ({ children }) => {
  return <header className={classes.header}>{children}</header>;
};

export default Header;
