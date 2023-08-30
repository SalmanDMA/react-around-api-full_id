import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

export default function EditProfilePopup(props) {
 const currentUser = useContext(CurrentUserContext) || {};

 return (
  <PopupWithForm
   isOpen={props.isOpen}
   onClose={props.onClose}
   title='Edit profile'
   name='form-edit'
   titleClass='form__header'
   onSubmit={props.handleSubmitProfile}
   refFormElement={props.refFormElement}
   refFormContainer={props.refFormContainer}
   refOverlay={props.refOverlay}
   handleOverlayClick={props.handleOverlayClick}
   handleOverlayMouseOver={props.handleOverlayMouseOver}
  >
   <input
    id='text-input'
    type='text'
    className='form__input form__name'
    name='inputName'
    value={props.nameProfile}
    onChange={() => props.validateInput(props.refName.current, props.refFormElement.current)}
    onInput={props.handleChangeNameProfile}
    required
    minLength='2'
    maxLength='40'
    placeholder='Nama'
    ref={props.refName}
   />
   <span className='text-input-error form__input-error'></span>
   <input
    id='text-input-dua'
    type='text'
    className='form__input form__job'
    name='inputJob'
    value={props.aboutProfile}
    onChange={() => props.validateInput(props.refJob.current, props.refFormElement.current)}
    onInput={props.handleChangeAboutProfile}
    required
    minLength='2'
    maxLength='200'
    placeholder='Tentang'
    ref={props.refJob}
   />
   <span className='text-input-dua-error form__input-error'></span>
   <button type='submit' className={`form__button form__button-save hover ${props.isLoading ? 'form__button_inactive' : ''} ${props.buttonDisabled ? 'form__button_inactive' : ''}`} aria-label='simpan'>
    {props.isLoading ? 'Menyimpan...' : 'Simpan'}
   </button>
  </PopupWithForm>
 );
}
