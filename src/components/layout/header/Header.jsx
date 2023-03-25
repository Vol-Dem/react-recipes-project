import classes from "./Header.module.scss";

const Header = (props) => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Your recipe book</div>
      {props.children}
    </header>
  );
};

export default Header;
