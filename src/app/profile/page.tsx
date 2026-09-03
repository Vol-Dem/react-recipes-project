import ProtectedRoute from "../../features/auth/components/ProtectedRoute/ProtectedRoute";
import Profile from "../../features/auth/pages/Profile/Profile";

export const metadata = { title: "Profile" };

const ProfilePage = () => (
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
);

export default ProfilePage;
