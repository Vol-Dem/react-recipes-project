import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "../features/auth/store/authThunks";
import AppRouter from "./AppRouter";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
