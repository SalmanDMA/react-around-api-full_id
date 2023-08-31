import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, loggedIn, tokenUser, ...props }) {

 if (!loggedIn && !tokenUser) {
  return <Navigate to='/signin' />;
 }
 if (tokenUser) {
  return children;
 }
 return children;
}
