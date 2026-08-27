import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initAuth } from "./store/auth";
import AppRouter from "./components/routing/AppRouter";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(initAuth());

    return unsubscribe;
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
