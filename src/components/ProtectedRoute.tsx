
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: string;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, checkAuthState } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // On initial render or when location changes, double-check auth state
    const verifyAuth = () => {
      const isAuth = checkAuthState();
      console.log("Protected route auth check:", { isAuth, user, path: location.pathname });
      
      // Validate role if needed
      const hasValidRole = allowedRole ? user?.role === allowedRole : true;
      setHasAccess(isAuth && hasValidRole);
      setIsChecking(false);
    };
    
    verifyAuth();
  }, [location.pathname, checkAuthState]);

  if (isChecking) {
    // Show loading spinner while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bus-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    // Save attempted URL for post-login redirect
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?from=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
