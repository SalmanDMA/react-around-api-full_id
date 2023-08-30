import { useEffect, useRef, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import AddPlacepopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import Footer from './Footer';

function Home({ dataUserToken, handleLogOut, loggedIn }) {
 const [currentUser, setCurrentUser] = useState(null);

 useEffect(() => {
  const fetchUserInfo = async () => {
   try {
    const userInfo = await api.getUserInfo();
    setCurrentUser(userInfo);
   } catch (error) {
    console.log('Failed to fetch user info:', error);
   }
  };

  fetchUserInfo();
 }, []);

 useEffect(() => {
  api
   .getInitialCards()
   .then((cards) => {
    setCardList(cards);
   })
   .catch((error) => {
    console.log(error);
   });
 }, []);

 useEffect(() => {
  setNameProfile(currentUser && currentUser.name ? currentUser.name : '');
  setAboutProfile(currentUser && currentUser.about ? currentUser.about : '');
 }, [currentUser]);

 const avatarInputRef = useRef();
 const inputJudul = useRef();
 const inputTautanGambar = useRef();
 const inputName = useRef();
 const inputJob = useRef();
 const buttonElement = useRef();
 const refFormAddPlaceElement = useRef();
 const refFormAvatarElement = useRef();
 const refFormProfileElement = useRef();
 const refsContainerPopup = {
  refFormContainerAvatarPopup: useRef(),
  refFormContainerAddPlacePopup: useRef(),
  refFormContainerImagePopup: useRef(),
  refFormContainerConfirmPopup: useRef(),
  refFormContainerEditProfilePopup: useRef(),
 };
 const refOverlay = useRef();
 const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
 const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
 const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
 const [isDeleteConfirmPopupOpen, setisDeleteConfirmPopupOpen] = useState(false);
 const [selectedCard, setSelectedCard] = useState(null);
 const [cardList, setCardList] = useState([]);
 const [deletingCard, setDeletingCard] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [buttonDisabled, setButtonDisabled] = useState(false);
 const [nameProfile, setNameProfile] = useState('');
 const [aboutProfile, setAboutProfile] = useState('');

 const handleEditProfileClick = () => {
  setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  setButtonDisabled(true);
 };

 const handleUpdateUser = (userInfo) => {
  const { nameProfile, aboutProfile } = userInfo;
  setIsLoading(true);
  api
   .patchUserInfo({ nameProfile, aboutProfile })
   .then((updatedUser) => {
    setCurrentUser(updatedUser);
    setIsLoading(false);
    closeAllPopups();
   })
   .catch((error) => {
    console.log(error);
   });
 };

 const handleChangeNameProfile = (e) => {
  setNameProfile(e.target.value);
 };

 const handleChangeAboutProfile = (e) => {
  setAboutProfile(e.target.value);
 };

 const handleSubmitProfile = (e) => {
  e.preventDefault();
  handleUpdateUser({
   nameProfile,
   aboutProfile,
  });
 };

 const handleCardClick = (card) => {
  setSelectedCard(card);
 };

 const handleDeleteClick = () => {
  setisDeleteConfirmPopupOpen(!isDeleteConfirmPopupOpen);
 };

 const handleCardDelete = (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (deletingCard) {
   api
    .deleteCard(deletingCard._id)
    .then(() => {
     setCardList((prevState) => prevState.filter((c) => c._id !== deletingCard._id));
     setDeletingCard(null);
     setIsLoading(false);
     closeAllPopups();
    })
    .catch((error) => {
     console.log(error);
    });
  }
 };

 const handleCardDeletePopupOpen = (card) => {
  setDeletingCard(card);
  handleDeleteClick();
 };

 const handleLikeClick = (card) => {
  const isLiked = card.likes.some((like) => like._id === currentUser._id);

  api
   .updateLikeCard(card._id, isLiked)
   .then((newCard) => {
    setCardList((state) => state.map((c) => (c._id === card._id ? newCard : c)));
   })
   .catch((error) => {
    console.log(error);
   });
 };

 const handleAddPlaceSubmit = (cardInfo) => {
  setIsLoading(true);

  api
   .postNewCard(cardInfo)
   .then((newCard) => {
    setCardList([newCard, ...cardList]);
    inputJudul.current.value = '';
    inputTautanGambar.current.value = '';
    setIsLoading(false);
    closeAllPopups();
   })
   .catch((error) => {
    console.log(error);
   });
 };

 const handleSubmitAddPlace = (e) => {
  e.preventDefault();

  handleAddPlaceSubmit({
   inputJudul: inputJudul.current.value,
   inputTautanGambar: inputTautanGambar.current.value,
  });
 };

 const handleAddPlaceClick = () => {
  setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  setButtonDisabled(true);
 };

 const handleEditAvatarClick = () => {
  setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  setButtonDisabled(true);
 };

 const handleUpdateAvatar = (avatarInfo) => {
  setIsLoading(true);
  api
   .patchAvatarUser(avatarInfo)
   .then((updatedUser) => {
    setCurrentUser(updatedUser);
    avatarInputRef.current.value = '';
    setIsLoading(false);
    closeAllPopups();
   })
   .catch((error) => {
    console.log(error);
   });
 };

 const handleSubmitAvatar = (e) => {
  e.preventDefault();
  handleUpdateAvatar({
   avatar: avatarInputRef.current.value,
  });
 };

 const closeAllPopups = () => {
  setIsEditAvatarPopupOpen(false);
  setIsEditProfilePopupOpen(false);
  setIsAddPlacePopupOpen(false);
  setisDeleteConfirmPopupOpen(false);
  setSelectedCard(null);

  resetValuesPopupForm();
 };

 const resetValuesPopupForm = () => {
  inputJudul.current.value = '';
  inputTautanGambar.current.value = '';
  inputName.current.value = '';
  inputJob.current.value = '';
  avatarInputRef.current.value = '';

  const judulErrorElement = inputJudul.current.nextElementSibling;
  judulErrorElement.textContent = '';

  const tautanGambarErrorElement = inputTautanGambar.current.nextElementSibling;
  tautanGambarErrorElement.textContent = '';

  const nameErrorElement = inputName.current.nextElementSibling;
  nameErrorElement.textContent = '';

  const jobErrorElement = inputJob.current.nextElementSibling;
  jobErrorElement.textContent = '';

  const avatarErrorElement = avatarInputRef.current.nextElementSibling;
  avatarErrorElement.textContent = '';
 };

 function validateInput(inputElement, formElement) {
  const errorElement = inputElement.nextElementSibling; // Ambil elemen <span> berikutnya

  // Periksa validitas input dalam konteks form yang bersangkutan
  const isValid = Array.from(formElement.querySelectorAll('.form__input')).every((input) => input.checkValidity());

  if (!inputElement.checkValidity()) {
   const errorMessage = inputElement.validationMessage;
   errorElement.textContent = errorMessage;
   buttonElement.current.classList.add('form__button_inactive');
  } else {
   errorElement.textContent = '';
   if (isValid) {
    buttonElement.current.classList.remove('form__button_inactive');
    setButtonDisabled(false);
   }
  }
 }

 const handleOverlayClick = (e) => {
  if (
   (!(refsContainerPopup.refFormContainerAddPlacePopup.current && refsContainerPopup.refFormContainerAddPlacePopup.current.contains(e.target)) &&
    !(refsContainerPopup.refFormContainerEditProfilePopup.current && refsContainerPopup.refFormContainerEditProfilePopup.current.contains(e.target)) &&
    !(refsContainerPopup.refFormContainerConfirmPopup.current && refsContainerPopup.refFormContainerAvatarPopup.current.contains(e.target)) &&
    !(refsContainerPopup.refFormContainerImagePopup.current && refsContainerPopup.refFormContainerImagePopup.current.contains(e.target))) ||
   refOverlay.current.contains(e.target)
  ) {
   return closeAllPopups();
  }
 };

 const handleOverlayClickOutside = (e) => {
  if (!(refsContainerPopup.refFormContainerAvatarPopup.current && refsContainerPopup.refFormContainerAvatarPopup.current.contains(e.target)) && refOverlay.current.contains(e.target)) {
   return closeAllPopups();
  }
 };

 const handleOverlayMouseOver = (e) => {
  if (refsContainerPopup.refFormContainerAddPlacePopup.current && refsContainerPopup.refFormContainerAddPlacePopup.current.contains(e.target)) {
   refOverlay.current.style.cursor = 'default';
   refsContainerPopup.refFormContainerAddPlacePopup.current.style.cursor = 'default';
  } else if (refsContainerPopup.refFormContainerEditProfilePopup.current && refsContainerPopup.refFormContainerEditProfilePopup.current.contains(e.target)) {
   refOverlay.current.style.cursor = 'default';
   refsContainerPopup.refFormContainerEditProfilePopup.current.style.cursor = 'default';
  } else if (refsContainerPopup.refFormContainerAvatarPopup.current && refsContainerPopup.refFormContainerAvatarPopup.current.contains(e.target)) {
   refOverlay.current.style.cursor = 'default';
   refsContainerPopup.refFormContainerAvatarPopup.current.style.cursor = 'default';
  } else if (refsContainerPopup.refFormContainerConfirmPopup.current && refsContainerPopup.refFormContainerConfirmPopup.current.contains(e.target)) {
   refOverlay.current.style.cursor = 'default';
   refsContainerPopup.refFormContainerConfirmPopup.current.style.cursor = 'default';
  } else if (refsContainerPopup.refFormContainerImagePopup.current && refsContainerPopup.refFormContainerImagePopup.current.contains(e.target)) {
   refOverlay.current.style.cursor = 'default';
   refsContainerPopup.refFormContainerImagePopup.current.style.cursor = 'default';
  } else {
   refOverlay.current.style.cursor = 'pointer';
  }
 };

 return (
  <>
   <div className='root'>
    <CurrentUserContext.Provider value={currentUser}>
     <Header dataUserToken={dataUserToken} text={'Logout'} handleLogOut={handleLogOut} loggedIn={loggedIn} />
     <Main
      onEditProfileClick={handleEditProfileClick}
      onAddPlaceClick={handleAddPlaceClick}
      onEditAvatarClick={handleEditAvatarClick}
      onCloseAllPopups={closeAllPopups}
      onCardClick={handleCardClick}
      onCardDeleteOpen={handleCardDeletePopupOpen}
      onLikeClick={handleLikeClick}
      onDeleteClick={handleDeleteClick}
      onDeleteCard={handleCardDelete}
      cardList={cardList}
      selectedCard={selectedCard}
      isDeleteConfirmPopupOpen={isDeleteConfirmPopupOpen}
      isLoading={isLoading}
      refFormContainerImagePopup={refsContainerPopup.refFormContainerImagePopup}
      refFormContainerConfirmPopup={refsContainerPopup.refFormContainerConfirmPopup}
      handleOverlayClick={handleOverlayClick}
      handleOverlayMouseOver={handleOverlayMouseOver}
      refOverlay={refOverlay}
     />
     <EditProfilePopup
      isOpen={isEditProfilePopupOpen}
      onClose={closeAllPopups}
      refName={inputName}
      refJob={inputJob}
      refButtonElement={buttonElement}
      buttonDisabled={buttonDisabled}
      refFormElement={refFormProfileElement}
      isLoading={isLoading}
      validateInput={validateInput}
      handleSubmitProfile={handleSubmitProfile}
      handleChangeNameProfile={handleChangeNameProfile}
      handleChangeAboutProfile={handleChangeAboutProfile}
      nameProfile={nameProfile}
      aboutProfile={aboutProfile}
      refFormContainer={refsContainerPopup.refFormContainerEditProfilePopup}
      refOverlay={refOverlay}
      handleOverlayClick={handleOverlayClick}
      handleOverlayMouseOver={handleOverlayMouseOver}
     />
     <AddPlacepopup
      isOpen={isAddPlacePopupOpen}
      onClose={closeAllPopups}
      onSubmit={handleSubmitAddPlace}
      refJudul={inputJudul}
      refTautanGambar={inputTautanGambar}
      refButtonElement={buttonElement}
      buttonDisabled={buttonDisabled}
      refFormElement={refFormAddPlaceElement}
      isLoading={isLoading}
      validateInput={validateInput}
      refFormContainer={refsContainerPopup.refFormContainerAddPlacePopup}
      handleOverlayClick={handleOverlayClick}
      handleOverlayMouseOver={handleOverlayMouseOver}
      refOverlay={refOverlay}
     />
     <EditAvatarPopup
      isOpen={isEditAvatarPopupOpen}
      onClose={closeAllPopups}
      onSubmit={handleSubmitAvatar}
      avatar={avatarInputRef}
      refButtonElement={buttonElement}
      buttonDisabled={buttonDisabled}
      refFormElement={refFormAvatarElement}
      isLoading={isLoading}
      validateInput={validateInput}
      refFormContainer={refsContainerPopup.refFormContainerAvatarPopup}
      refOverlay={refOverlay}
      handleOverlayClick={handleOverlayClickOutside}
      handleOverlayMouseOver={handleOverlayMouseOver}
     />
     <Footer />
    </CurrentUserContext.Provider>
   </div>
  </>
 );
}

export default Home;
