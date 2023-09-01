class Api {
 constructor({ baseUrl, headers }) {
  this.baseUrl = baseUrl;
  this.headers = headers;
 }
 getInitialCardsAndUserInfo() {
  return Promise.all([this.getInitialCards(), this.getUserInfo()]);
 }
 async getUserInfo() {
  try {
   const res = await fetch(`${this.baseUrl}/users/me`, {
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async getInitialCards() {
  try {
   const res = await fetch(`${this.baseUrl}/cards`, {
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
   });

   const data = await res.json();
   return data;
  } catch (err) {
   throw err;
  }
 }

 async postNewCard(data) {
  try {
   const res = await fetch(`${this.baseUrl}/cards`, {
    method: 'POST',
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
     name: data.inputJudul,
     link: data.inputTautanGambar,
    }),
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async updateLikeCard(cardId, isLiked) {
  try {
   const method = isLiked ? 'DELETE' : 'PUT';
   const res = await fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
    method,
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async deleteCard(cardId) {
  try {
   const res = await fetch(`${this.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async patchUserInfo(data) {
  try {
   const res = await fetch(`${this.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
     name: data.nameProfile,
     about: data.aboutProfile,
    }),
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async patchAvatarUser(url) {
  try {
   const res = await fetch(`${this.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: { ...this.headers, Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({
     avatar: url.avatar,
    }),
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }
}

const getToken = () => localStorage.getItem('jwt');

const api = new Api({
 baseUrl: 'http://localhost:3000',
 headers: {
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
 },
});

export default api;
