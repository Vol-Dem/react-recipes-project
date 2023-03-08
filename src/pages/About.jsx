import { useState } from "react";
import Spinner from "../components/ui/Spinner";
import classes from "./About.module.css";

const About = () => {
  const [test, setTest] = useState(false);
  const exe = () => {
    setTest(!test);
  };
  return (
    <>
      <div className={`${classes.about} ${test && classes.anim}`}>
        <div className={classes.div}>a</div>
        {test && <div>b</div>}
        <div>c</div>
        <div>d</div>
      </div>
      <Spinner />
      <button onClick={exe}>push</button>
    </>
  );
};

export default About;
