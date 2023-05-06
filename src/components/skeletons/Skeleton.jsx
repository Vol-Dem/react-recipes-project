import classes from "./Skeleton.module.scss";

const Skeleton = ({ classNames }) => {
  const className = `${classes.skeleton} ${classNames
    .split(" ")
    .map((className) => `${classes[className]}`)
    .join(" ")} ${classes["animate-pulse"]}`;
  return <div className={className}></div>;
};

export default Skeleton;
