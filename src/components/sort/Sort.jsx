import classes from "./Sort.module.css";

const Sort = () => {
  return (
    <div className={classes["search-head__sort"]}>
      <span>Sort by</span>
      <select
        className={classes["search-head__sort--select"]}
        name="sort"
        id=""
      >
        <option value="italian">Calory</option>
        <option value="french">Time</option>
      </select>
    </div>
  );
};

export default Sort;
