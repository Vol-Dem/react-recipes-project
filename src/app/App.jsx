import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "../features/auth/store/authThunks";
import AppRouter from "./AppRouter";
import { MotionConfig } from "framer-motion";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return (
    <MotionConfig reducedMotion="user">
      <AppRouter />
    </MotionConfig>
  );
};

export default App;
