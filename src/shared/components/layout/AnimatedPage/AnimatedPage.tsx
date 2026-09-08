"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../constants/animations";

const AnimatedPage = ({ children }: PropsWithChildren) => (
  <motion.div initial={ANIMATION_SLIDE_IN_INITIAL} animate={ANIMATION_SLIDE_IN}>
    {children}
  </motion.div>
);

export default AnimatedPage;
