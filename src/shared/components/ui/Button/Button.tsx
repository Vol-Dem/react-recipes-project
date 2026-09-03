import classes from "./Button.module.scss";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";
import {
  BUTTON_HOVER_ANIMATION,
  BUTTON_TAP_ANIMATION,
} from "../../../constants";

type ButtonProps = PropsWithChildren<HTMLMotionProps<"button">>;

const Button = ({ children, className, ...buttonProps }: ButtonProps) => {
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
