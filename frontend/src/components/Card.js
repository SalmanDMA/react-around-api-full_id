import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card(props) {
 const currentUser = useContext(CurrentUserContext) || {};
 const isOwn = props.card.owner._id === currentUser._id;
 const isLiked = props.card.likes.some((like) => like._id === currentUser._id);

 return (
  <div className='card__item' key={props.card.id}>
   <img className='card__image' alt={props.card.name} src={props.card.link} onClick={props.onCardClick} />
   <button className={`${isOwn ? 'card__icon-delete' : 'card__icon-delete_hidden'} hover-icon`} onClick={props.onCardDelete}></button>
   <div className='card__main-text'>
    <h3 className='card__title'>{props.card.name}</h3>
    <div className='card__likes'>
     <button className={`card__icon hover-icon ${isLiked ? 'card__icon_active' : ''}`} onClick={props.onLikeClick}></button>
     <p className='card__likes-text'>{props.card.likes.length}</p>
    </div>
   </div>
  </div>
 );
}
