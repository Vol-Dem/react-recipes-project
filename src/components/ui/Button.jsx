import classes from "./Button.module.scss";
import { motion } from "framer-motion";

const Button = ({ children, className, ...buttonProps }) => {
  return (
    <motion.button
      {...buttonProps}
      whileHover={{ scale: 1.1, transition: { type: "spring" } }}
      whileTap={{ scale: 0.95 }}
      className={`${classes.btn} ${className || ""}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
