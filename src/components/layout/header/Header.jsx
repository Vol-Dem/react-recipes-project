import classes from "./Header.module.css";

const Header = (props) => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Your recipe book</div>
      {props.children}
    </header>
  );
};

export default Header;
