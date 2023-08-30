import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Header({ text, handleLogOut, dataUserToken, loggedIn, link }) {
 const [showMenu, setShowMenu] = useState(false);

 const handleMenuToggle = () => {
  setShowMenu(!showMenu);
 };

 return (
  <>
   <div className={`header__button-toggle ${showMenu ? 'show' : ''}`}>
    {loggedIn && <p>{dataUserToken.data.email}</p>}
    <button type='button' onClick={handleLogOut}>
     {text}
    </button>
   </div>
   <header className='header'>
    <h1 className='header__title'>Around</h1>
    {text === 'Logout' && (
     <>
      <div className='header__button'>
       {loggedIn && <p>{dataUserToken.data.email}</p>}
       <button type='button' onClick={handleLogOut}>
        {text}
       </button>
      </div>
      <button className={`header__toggle ${showMenu ? 'show' : ''}`} onClick={handleMenuToggle}>
       <FontAwesomeIcon icon={showMenu ? faTimes : faBars} />
      </button>
     </>
    )}
    {text !== 'Logout' && (
     <Link to={link} className='header__subtitle'>
      {text}
     </Link>
    )}
   </header>
  </>
 );
}
