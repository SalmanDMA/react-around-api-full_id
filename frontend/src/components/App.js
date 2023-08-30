import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Home from './Home';
import { registerUser, loginUser, checkTokenValidity } from '../utils/auth';

function App() {
 const [loggedIn, setLoggedIn] = useState(false);
 const tokenUser = localStorage.getItem('jwt');
 const [dataUserToken, setDataUserToken] = useState(null);

 useEffect(() => {
  if (tokenUser) {
   handleUser(tokenUser).then((response) => {
    setDataUserToken(response);
   });
  }
 }, [tokenUser]);

 const handleRegister = async (email, password) => {
  try {
   const response = await registerUser(email, password);
   return response;
  } catch (error) {
   console.error('Error registering user:', error);
  }
 };

 const handlelogin = async (email, password) => {
  try {
   const response = await loginUser(email, password);
   return response;
  } catch (error) {
   console.error('Error logging in user:', error);
  }
 };

 const handleUser = async (token) => {
  try {
   const response = await checkTokenValidity(token);
   return response;
  } catch (error) {
   console.error('Error checking token validity:', error);
  }
 };

 const handleLogOut = () => {
  setLoggedIn(false);
  localStorage.removeItem('jwt');
 };

 return (
  <Router>
   <Routes>
    <Route path='/signup' element={<Register handleRegister={handleRegister} />} />
    <Route path='/signin' element={<Login handlelogin={handlelogin} setLoggedIn={setLoggedIn} />} />
    <Route
     path='/'
     element={
      <ProtectedRoute loggedIn={loggedIn} tokenUser={tokenUser}>
       <Home handleLogOut={handleLogOut} loggedIn={loggedIn} dataUserToken={dataUserToken} />
      </ProtectedRoute>
     }
    />
   </Routes>
  </Router>
 );
}

export default App;
