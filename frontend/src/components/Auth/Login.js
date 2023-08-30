import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import InfoTooltip from '../InfoTooltip';

export default function Login({ handlelogin, setLoggedIn }) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [passwordVisible, setPasswordVisible] = useState(false);
 const [emailError, setEmailError] = useState('');
 const [passwordError, setPasswordError] = useState('');
 const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);
 const [showErrorTooltip, setShowErrorTooltip] = useState(false);
 const navigate = useNavigate();

 const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
 };

 const validateEmail = (value) => {
  if (!value) {
   setEmailError('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(value)) {
   setEmailError('Invalid email format');
  } else {
   setEmailError('');
  }
 };

 const validatePassword = (value) => {
  if (!value) {
   setPasswordError('Password is required');
  } else {
   setPasswordError('');
  }
 };

 const handleSubmit = async (event) => {
  event.preventDefault();

  if (!email || !password || emailError || passwordError) {
   return;
  }

  try {
   const response = await handlelogin(email, password);
   if (response.token) {
    setShowSuccessTooltip(true);
    setLoggedIn(true);
    localStorage.setItem('jwt', response.token);
   } else {
    setShowErrorTooltip(true);
   }
  } catch (error) {
   console.error('Error registering user:', error);
   setShowErrorTooltip(true);
  }
 };

 useEffect(() => {
  if (showSuccessTooltip) {
   const timeoutId = setTimeout(() => {
    setShowSuccessTooltip(false);
    navigate('/');
   }, 3000);

   return () => clearTimeout(timeoutId);
  }
 }, [showSuccessTooltip, navigate]);

 return (
  <div className='root'>
   <Header text='Daftar' link='/signup' />
   <div className='form-auth'>
    <h1 className='form-auth__title'>Login</h1>
    <form onSubmit={handleSubmit}>
     <div className='form-auth__inputs'>
      <input
       className='form-auth__input'
       type='text'
       placeholder='Email'
       value={email}
       onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
       }}
      />
      {emailError && <p className='error-message'>{emailError}</p>}
      <div style={{ position: 'relative' }}>
       <input
        className='form-auth__input'
        type={passwordVisible ? 'text' : 'password'}
        placeholder='Password'
        value={password}
        onChange={(e) => {
         setPassword(e.target.value);
         validatePassword(e.target.value);
        }}
       />
       <span className='form-auth__icon' onClick={togglePasswordVisibility}>
        {password.length > 0 && <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />}
       </span>
      </div>
      {passwordError && <p className='error-message'>{passwordError}</p>}
     </div>
     <div className='form-auth__buttons'>
      <button type='submit' className='form-auth__button' disabled={!email || !password || emailError || passwordError}>
       Login
      </button>
      <p className='form-auth__text'>
       Belum jadi anggota ? <Link to={'/signup'}>Daftar di sini!</Link>
      </p>
     </div>
    </form>
   </div>
   {showSuccessTooltip && (
    <InfoTooltip
     success={true}
     message='Login berhasil! Redirecting...'
     onClose={() => {
      setShowSuccessTooltip(false);
      navigate('/');
     }}
    />
   )}
   {showErrorTooltip && <InfoTooltip success={false} message='Ups! Ada yang salah. Coba lagi.' onClose={() => setShowErrorTooltip(false)} />}
  </div>
 );
}
