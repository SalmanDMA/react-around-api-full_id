export default function ImagePopup(props) {
 return (
  <div ref={props.refOverlay} className={`overlay ${props.isOpen ? 'block' : ''}`} onClick={props.handleOverlayClick} onMouseOver={props.handleOverlayMouseOver}>
   <div ref={props.refFormContainer} className={`pop-up ${props.isOpen ? 'block' : ''}`}>
    <img className='pop-up__image' alt={props.card ? props.card.name : ''} src={props.card ? props.card.link : ''} />
    <button className='pop-up__icon hover-icon' onClick={props.onClose}></button>
    <h3 className='pop-up__title'>{props.card ? props.card.name : ''}</h3>
   </div>
  </div>
 );
}
