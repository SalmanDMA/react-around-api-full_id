import FormValidator from '../components/formValidation.js';
import './index.css';
import {
 sectionProfile,
 inputName,
 inputJob,
 valueInputName,
 valueInputJob,
 cardContainer,
 imagePopupSelector,
 popupWithConfirmSelector,
 avatarSelector,
 popupAvatarSelector,
 editProfilePopupSelector,
 addNewCardPopupSelector,
 buttonEditProfile,
 buttonNewCard,
 data,
} from '../utils/constants.js';
import Section from '../components/section.js';
import { Card } from '../components/card.js';
import PopupWithImage from '../components/popupWithImage.js';
import PopupWithForm from '../components/popupWithForm.js';
import UserInfo from '../components/userInfo.js';
import AlertBox from '../components/alertBox.js';
import Api from '../components/api.js';
import PopupWithConfirm from '../components/popupWithConfirm.js';

// classes
const api = new Api({
 baseUrl: 'https://around.nomoreparties.co/v1/web_idn_cohort_01',
 headers: {
  authorization: 'a55a2a11-c51d-4757-bac3-b5d796b811b7',
  'Content-Type': 'application/json',
 },
});

const profileInfo = new UserInfo(valueInputName, valueInputJob, avatarSelector);

const editProfilePopup = new PopupWithForm(editProfilePopupSelector, editProfileSubmitHandler);

const addNewCardPopup = new PopupWithForm(addNewCardPopupSelector, addCardSubmitHandler);

const editAvatarPopup = new PopupWithForm(popupAvatarSelector, editAvatarSubmitHandler);

const popupImage = new PopupWithImage(imagePopupSelector);

const popupConfirm = new PopupWithConfirm(popupWithConfirmSelector, deleteCardSubmitHandler);

const cardList = new Section(
 {
  items: [],
  renderer: () => {},
 },
 cardContainer
);

const alertBoxUserInfo = new AlertBox({
 sectionProfile: sectionProfile,
 alertContainer: 'section',
 alertText: 'h3',
});

const alertBoxNewCard = new AlertBox({
 sectionProfile: sectionProfile,
 alertContainer: 'section',
 alertText: 'h3',
});

const alertEditAvatar = new AlertBox({
 sectionProfile: sectionProfile,
 alertContainer: 'section',
 alertText: 'h3',
});

const alertDeleteCard = new AlertBox({
 sectionProfile: sectionProfile,
 alertContainer: 'section',
 alertText: 'h3',
});

// function

function editProfileSubmitHandler(data) {
 editProfilePopup.showPatchStatus(true);
 api
  .patchUserInfo(data)
  .then(() => {
   profileInfo.setUserInfo(data);
  })
  .then(() => {
   editProfilePopup.showPatchStatus(false);
   editProfilePopup.close();
   alertBoxUserInfo.generateAlertBox(`Selamat perubahan data ${data.inputName} dan ${data.inputJob} telah berhasil !!!`);
  })
  .catch((err) => {
   alert(err);
   editProfilePopup.showPatchStatus(false);
  });
}

function editAvatarSubmitHandler(data) {
 editAvatarPopup.showPatchStatus(true);
 api
  .patchAvatarUser(data.inputAvatar)
  .then(() => {
   profileInfo.setUserAvatar(data.inputAvatar);
  })
  .then(() => {
   editAvatarPopup.showPatchStatus(false);
   editAvatarPopup.close();
   alertEditAvatar.generateAlertBox(`Selamat perubahan foto profil dari ${data.inputAvatar} telah berhasil !!!`);
  })
  .catch((err) => {
   alert(err);
   editAvatarPopup.showPatchStatus(false);
  });
}

function handleCardClick(items) {
 popupImage.open(items);
}

function handleLikeClick(card, cardId, isLiked) {
 api
  .updateLikeCard(cardId, isLiked)
  .then((data) => {
   card._likes = data.likes;
  })
  .catch((err) => {
   alert(err);
  });
}

function openPopupConfirm(cardElement, cardId, cardName) {
 popupConfirm.open(cardElement, cardId, cardName);
}

function deleteCardSubmitHandler(cardElement, cardId, cardName) {
 api
  .deleteCard(cardId)
  .then(() => {
   popupConfirm.close();
   cardElement.remove();
   alertDeleteCard.generateAlertBox(`Selamat card ${cardName} telah dihapus !!!`);
  })
  .catch((err) => {
   alert(err);
  });
}

function makeNewCard(data, userId) {
 const cardItem = new Card(data, userId, handleCardClick, handleLikeClick, openPopupConfirm);
 const cardElement = cardItem.generateCard();

 return cardElement;
}

function addCardSubmitHandler(data) {
 addNewCardPopup.showPatchStatus(true);
 api
  .postNewCard(data)
  .then((data) => {
   cardList.addItem(makeNewCard(data, data.owner._id), true);
  })
  .then(() => {
   addNewCardPopup.showPatchStatus(false);
   addNewCardPopup.close();
   alertBoxNewCard.generateAlertBox(`Selamat data berhasil di tambahkan dengan judul ${data.inputJudul}`);
  })
  .catch((err) => {
   alert(err);
   addNewCardPopup.showPatchStatus(false);
  });
}

// calls / listen
api
 .getInitialCardsAndUserInfo()
 .then(([initialCards, userInfo]) => {
  initialCards.forEach((initialCard) => {
   cardList.addItem(makeNewCard(initialCard, userInfo._id), false);
  });
  valueInputName.textContent = userInfo.name;
  valueInputJob.textContent = userInfo.about;
  avatarSelector.src = userInfo.avatar;
 })
 .catch((err) => {
  alert(err);
 });

sectionProfile.addEventListener('click', (event) => {
 if (event.target.classList.contains('profile__edit')) {
  const profileInput = profileInfo.getUserInfo();
  inputName.value = profileInput.name;
  inputJob.value = profileInput.job;
  buttonEditProfile.classList.add('form__button_inactive');
  editProfilePopup.open();
 } else if (event.target.classList.contains('profile__add')) {
  buttonNewCard.classList.add('form__button_inactive');
  addNewCardPopup.open();
 } else {
  return;
 }
});
editProfilePopup.setEventListeners();
avatarSelector.addEventListener('click', () => {
 editAvatarPopup.open();
});
editAvatarPopup.setEventListeners();
popupImage.setEventListeners();
addNewCardPopup.setEventListeners();
popupConfirm.setEventListeners();

// forms Validation
const forms = Array.from(document.querySelectorAll(data.formSelector));

forms.forEach((formElement) => {
 const validator = new FormValidator(data, formElement);

 validator.enableValidation();
});
