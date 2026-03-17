import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user, loading, allowedRoles }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-10 h-10 border-3 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;