import { Navigate, useLocation } from "react-router-dom";
import { useProfileQuery } from "../redux/apiSlices/authSlice";

// --- Decode JWT token ---
const parseJwt = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const allowedRoles = ["ADMIN_MERCENT", "MERCENT", "VIEW_MERCENT"];

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // Step 1 — Try reading role from JWT (no API hit)
  const tokenPayload = parseJwt();
  const tokenRole = tokenPayload?.role;
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute Debug:", {
    hasToken: !!token,
    tokenRole,
    tokenPayload,
  });

  // If token already has valid role, allow fast path
  if (tokenRole && allowedRoles.includes(tokenRole)) {
    console.log("Token role is valid, allowing access");
    return children;
  }

  // Step 2 — Otherwise check profile from API
  const {
    data: profile,
    isLoading,
    isError,
  } = useProfileQuery(undefined, {
    skip: !localStorage.getItem("token"), // don't fetch if no token
  });

  console.log("Profile data:", profile);
  console.log("Is loading:", isLoading);
  console.log("Is error:", isError);

  // While loading, show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3FAE6A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If API failed → user not logged in
  if (isError) {
    console.log("Profile query error, redirecting to login");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If profile role matches allowed roles → allow
  if (profile?.role && allowedRoles.includes(profile.role)) {
    return children;
  }

  // Otherwise unauthorized
  console.log("User role not authorized:", profile?.role);
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
