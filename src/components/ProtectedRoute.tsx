import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Ngược lại, nếu user là admin mà cố vào các trang của user thường
  // (Tùy nhu cầu, ở đây ta có thể để admin xem được cả 2 hoặc chặn)
  // Trong yêu cầu của bạn, Admin "chỉ có 1 màn hình đó thôi"
  if (!requireAdmin && role === 'admin' && location.pathname !== '/auth') {
     return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
