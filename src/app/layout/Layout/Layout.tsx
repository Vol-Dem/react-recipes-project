import Header from "../Header/Header";
import classes from "./Layout.module.scss";
import MainNavigation from "../Navigation/MainNavigation/MainNavigation";
import Link from "next/link";
import MobileNavigation from "../Navigation/MobileNavigation/MobileNavigation";
import AuthNavigation from "../Navigation/AuthNavigation/AuthNavigation";
import AppOverlays from "../AppOverlays/AppOverlays";
import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div id="app-root">
      <div className={classes.wrapper}>
        <Header>
          <MobileNavigation />
          <Link href="/" className={classes.logo}>
            Your recipe book
          </Link>
          <MainNavigation />
          <AuthNavigation />
        </Header>

        <main>{children}</main>
      </div>
      <AppOverlays />
    </div>
  );
};

export default Layout;
