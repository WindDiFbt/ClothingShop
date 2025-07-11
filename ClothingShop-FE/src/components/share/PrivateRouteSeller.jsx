import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRouteSeller({ children }) {
  const { token, user } = useSelector((state) => state.auth);
  if (!token || user?.role !== "SELLER") {
    return <Navigate to="/home" replace />;
  }
  return children;
}
