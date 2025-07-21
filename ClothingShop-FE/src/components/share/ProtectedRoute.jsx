import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const { token, user, status } = useSelector((state) => state.auth);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token || !user) {
    toast.error("Vui lòng đăng nhập để truy cập trang này");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    toast.error("Bạn không có quyền truy cập trang này");
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
export { AdminProtectedRoute };
