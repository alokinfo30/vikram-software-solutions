// client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" />;
    }

    // Role comes from stored user (login response), not JWT payload
    const user = userJson ? JSON.parse(userJson) : null;
    const userRole = user?.role;

    if (role && userRole !== role) {
      return <Navigate to={userRole ? `/${userRole}` : '/login'} />;
    }

    return children || <Outlet />;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;