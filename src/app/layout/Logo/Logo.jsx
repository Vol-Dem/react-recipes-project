import classes from "./Logo.module.scss";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.h1
      exit={{ height: 0, overflow: "hidden", margin: 0, opacity: 0 }}
      className={classes.logo}
    >
      Your recipe book
    </motion.h1>
  );
};

export default Logo;
