import Card from "../components/ui/Card";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../variables/constants";
import classes from "./About.module.scss";
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
    >
      <Card>
        {/* <h1 className={classes["about__h1"]}>
          Welcome to the “Your recipe book”!
        </h1>
        <p className={classes["about__text"]}>
          This is a virtual space where cooking enthusiasts can find and save
          their favorite recipes. This convenient and attractive web application
          will allow you to easily find recipes by type of dish, cuisine or
          special requirements such as dietary restrictions, calories, cooking
          time, etc.
        </p> */}
        <h1 className={classes["about__h1"]}>
          Welcome to the “Your recipe book”!
        </h1>
        <p className={classes["about__text"]}>
          Welcome to "Your Recipe Book", the ultimate destination for cooking
          enthusiasts!
        </p>
        <p className={classes["about__text"]}>
          This&nbsp;platform is designed to be your go-to virtual space for
          discovering, organizing, and saving your favorite recipes. Whether
          you're a seasoned chef, an aspiring home cook, or someone just looking
          for quick meal ideas, Your Recipe Book has something for everyone.
        </p>
        <p className={classes["about__text"]}>
          With our intuitive and attractive web application, you can:
        </p>
        <ul className={classes["about__list"]}>
          <li className={classes["about__list-item"]}>
            Easily find recipes by type of dish, cuisine, or occasion.
          </li>
          <li className={classes["about__list-item"]}>
            Filter recipes based on dietary preferences, calorie count, cooking
            time, and more.
          </li>
          <li className={classes["about__list-item"]}>
            Save your favorite recipes in one place for easy access whenever
            inspiration strikes.
          </li>
        </ul>
        <p className={classes["about__text"]}>
          At Your Recipe Book, we believe that cooking should be accessible,
          enjoyable, and personalized. That&rsquo;s why we&rsquo;ve created a
          platform that adapts to your needs and makes exploring the culinary
          world simple and fun.
        </p>
        <p className={classes["about__text"]}>
          Join us in creating a vibrant community of food lovers, and
          let&rsquo;s make cooking a delightful experience together!
        </p>
        <p className={classes["about__text"]}>Happy cooking!</p>
      </Card>
    </motion.div>
  );
};

export default About;
