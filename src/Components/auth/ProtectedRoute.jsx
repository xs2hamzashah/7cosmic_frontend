import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  //   const { user } = useAuth();
  if (false) {
    return <Navigate to="/login" />;
  }
  return children;
};
