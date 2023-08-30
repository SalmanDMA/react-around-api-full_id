import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup(props) {
 return (
  <PopupWithForm
   name='form-avatar'
   title='Ubah Foto Profil'
   titleClass='form-avatar__title'
   isOpen={props.isOpen}
   onClose={props.onClose}
   onSubmit={props.onSubmit}
   refFormElement={props.refFormElement}
   refFormContainer={props.refFormContainer}
   refOverlay={props.refOverlay}
   handleOverlayClick={props.handleOverlayClick}
   handleOverlayMouseOver={props.handleOverlayMouseOver}
  >
   <input
    id='input-url-avatar'
    name='inputAvatar'
    type='url'
    className='form__input form__avatar'
    placeholder='Isi link disini...'
    ref={props.avatar}
    required
    onChange={() => props.validateInput(props.avatar.current, props.refFormElement.current)}
   />
   <span className='input-url-avatar-error form__input-error form__input-avatar'></span>
   <button ref={props.refButtonElement} type='submit' className={`form__button form__button-avatar hover ${props.isLoading ? 'form__button_inactive' : ''} ${props.buttonDisabled ? 'form__button_inactive' : ''}`} aria-label='Simpan'>
    {props.isLoading ? 'Menyimpan...' : 'Simpan'}
   </button>
  </PopupWithForm>
 );
}
