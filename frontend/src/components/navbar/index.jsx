import React, { useState, useEffect } from 'react';
import './styles.css';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar usuário do sessionStorage (caso já esteja logado)
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const openRegisterFromLogin = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  return (
    <>
      <header>
        <nav aria-label='Primary navigation' className='nav-left'>
          <button type='button'>New In</button>
          <button type='button'>Men</button>
          <button type='button'>Women</button>
          <button type='button'>Accessories</button>
          <button type='button'>Shoes</button>
        </nav>

        <div className='nav-right'>
          <div className='search-container' role='search'>
            <input aria-label='Buscar' placeholder='Buscar' type='search' />
            <i aria-hidden='true' className='fas fa-search'></i>
          </div>

          <button
            aria-label='User account'
            className='icon-btn'
            onClick={() => !user && setShowLoginModal(true)}
          >
            {user && <span className='user-name'>{user.name}</span>}
            <i className='fas fa-user'></i>
          </button>

          <button aria-label='Shopping bag' className='bag-btn'>
            Bag <i className='fas fa-lock'></i>
          </button>
        </div>
      </header>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={openRegisterFromLogin}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;
