import { Navigate } from "react-router-dom";
import { StyledLoader } from "../../Components/Common/Index";

export const ProtectedRoute = ({
  condition,
  navigate,
  requiredRoles = [],
  children,
  isLoading,
}) => {
  if (isLoading) {
    return <StyledLoader />;
  }

  // Basic authentication check
  if (!condition) {
    return <Navigate to={navigate.to} state={{ message: navigate.message }} />;
  }

  // If roles are specified, check if user has the required role
  if (requiredRoles.length > 0) {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    if (!userRole || !requiredRoles.includes(userRole)) {
      // Redirect to the appropriate base path based on the user's role
      return <Navigate to={`/${userRole || "student"}`} />;
    }
  }

  return children;
};
