import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ceklisIcon from '../assets/image/info-tooltip/success.png';
import wrongIcon from '../assets/image/info-tooltip/wrong.png';

const InfoTooltip = ({ success, message, onClose }) => {
 return (
  <div className='info-tooltip-overlay'>
   <div className='info-tooltip'>
    <div className={`info-tooltip-icon ${success ? 'success' : 'error'}`}>
     <img src={success ? ceklisIcon : wrongIcon} alt='icon success / wrong' className='info-tooltip-icon-img' />
    </div>
    <p className='info-tooltip-message'>{message}</p>
    <button className='info-tooltip-close' onClick={onClose}>
     <FontAwesomeIcon icon={faTimes} />
    </button>
   </div>
  </div>
 );
};

export default InfoTooltip;
