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
    headers: this.headers,
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
    headers: this.headers,
   });

   if (res.ok) {
    return res.json();
   }
  } catch (err) {
   throw err;
  }
 }

 async postNewCard(data) {
  try {
   const res = await fetch(`${this.baseUrl}/cards`, {
    method: 'POST',
    headers: this.headers,
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
   const res = await fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
    headers: this.headers,
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
    headers: this.headers,
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
    headers: this.headers,
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
    headers: this.headers,
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

const api = new Api({
 baseUrl: 'https://around.nomoreparties.co/v1/web_idn_cohort_01',
 headers: {
  authorization: 'a55a2a11-c51d-4757-bac3-b5d796b811b7',
  'Content-Type': 'application/json',
 },
});

export default api;
