import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, loggedIn, tokenUser, ...props }) {
 console.log(tokenUser);

 if (!loggedIn && !tokenUser) {
  return <Navigate to='/signin' />;
 }
 if (tokenUser) {
  console.log('masuk');
  return children;
 }
 return children;
}
