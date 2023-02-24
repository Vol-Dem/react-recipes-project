import Header from "./header/Header";
import classes from "./Layout.module.css";
import MainNavigation from "./navigation/MainNavigation";
import { Outlet } from "react-router-dom";

const Layout = (props) => {
  return (
    <div className={classes.wrapper}>
      <Header>
        <MainNavigation />
      </Header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
