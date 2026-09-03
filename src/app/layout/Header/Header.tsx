import classes from "./Header.module.scss";
import type { PropsWithChildren } from "react";

const Header = ({ children }: PropsWithChildren) => {
  return <header className={classes.header}>{children}</header>;
};

export default Header;
