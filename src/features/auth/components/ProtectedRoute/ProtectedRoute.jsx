import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuthIsInitialized,
  selectAuthIsLoggedIn,
} from "../../store/authSelectors";

const ProtectedRoute = () => {
  const isInitialized = useSelector(selectAuthIsInitialized);
  const isLoggedIn = useSelector(selectAuthIsLoggedIn);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
