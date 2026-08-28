import classes from "./Logo.module.scss";
import { motion } from "framer-motion";

const LOGO_EXIT_ANIMATION = {
  height: 0,
  margin: 0,
  opacity: 0,
  overflow: "hidden",
};

const Logo = () => {
  return (
    <motion.h1
      exit={LOGO_EXIT_ANIMATION}
      className={classes.logo}
    >
      Your recipe book
    </motion.h1>
  );
};

export default Logo;
