import PopupWithForm from './PopupWithForm';

export default function AddPlacepopup(props) {
 return (
  <PopupWithForm
   name='form-add'
   title='Tempat Baru'
   titleClass='form__header'
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
    id='text-input-tiga'
    type='text'
    name='inputJudul'
    className='form__input form__name'
    placeholder='Judul'
    required
    minLength='2'
    ref={props.refJudul}
    maxLength='30'
    onChange={() => props.validateInput(props.refJudul.current, props.refFormElement.current)}
   />
   <span className='text-input-tiga-error form__input-error'></span>
   <input
    id='input-url'
    type='url'
    name='inputTautanGambar'
    className='form__input form__job'
    placeholder='Tautan gambar'
    ref={props.refTautanGambar}
    onChange={() => props.validateInput(props.refTautanGambar.current, props.refFormElement.current)}
    required
   />
   <span className='input-url-error form__input-error'></span>
   <button ref={props.refButtonElement} type='submit' className={`form__button form__button-create hover ${props.isLoading ? 'form__button_inactive' : ''} ${props.buttonDisabled ? 'form__button_inactive' : ''}`} aria-label='buat'>
    {props.isLoading ? 'Membuat...' : 'Buat'}
   </button>
  </PopupWithForm>
 );
}
