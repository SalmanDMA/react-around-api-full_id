export const registerUser = async (email, password) => {
 try {
  const response = await fetch('https://register.nomoreparties.co/signup', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
 } catch (error) {
  console.error('Error registering user:', error);
  throw error;
 }
};

export const loginUser = async (email, password) => {
 try {
  const response = await fetch('https://register.nomoreparties.co/signin', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
 } catch (error) {
  console.error('Error logging in user:', error);
  throw error;
 }
};

export const checkTokenValidity = async (token) => {
 try {
  const response = await fetch('https://register.nomoreparties.co/users/me', {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
   },
  });

  const data = await response.json();
  return data;
 } catch (error) {
  console.error('Error checking token validity:', error);
  throw error;
 }
};
