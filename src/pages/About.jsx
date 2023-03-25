import { useState } from "react";
import classes from "./About.module.scss";
// import testImg from "./../assets/test.jpg";

const About = () => {
  const [test, setTest] = useState(false);
  const exe = () => {
    setTest(!test);
  };
  return (
    <>
      <div className={`${classes.about} ${test ? classes.anim : ""}`}>
        <div className={classes.div}>a</div>
        {test && <div>b</div>}
        <div>c</div>
        <div>d</div>
      </div>
      <button onClick={exe} className={classes.btn}>
        push
      </button>
    </>
  );
};

export default About;
