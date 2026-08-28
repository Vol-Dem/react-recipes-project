import classes from "./Button.module.scss";
import { motion } from "framer-motion";
import {
  BUTTON_HOVER_ANIMATION,
  BUTTON_TAP_ANIMATION,
} from "../../../constants";

const Button = ({ children, className, ...buttonProps }) => {
  return (
    <motion.button
      {...buttonProps}
      whileHover={BUTTON_HOVER_ANIMATION}
      whileTap={BUTTON_TAP_ANIMATION}
      className={`${classes.btn} ${className || ""}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
