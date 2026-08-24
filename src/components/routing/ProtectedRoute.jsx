import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isInitialized, isLoggedIn } = useSelector((state) => state.auth);
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
