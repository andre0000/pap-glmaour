import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      <nav className='navbar navbar-expand-lg navbar-light bg-light px-3'>
        <a className='navbar-brand' href='/'>
          Glamour
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarTogglerDemo03'
          aria-controls='navbarTogglerDemo03'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarTogglerDemo03'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <a className='nav-link' href='#'>
                Products
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link disabled'
                href='#'
                tabIndex='-1'
                aria-disabled='true'
              ></a>
            </li>
          </ul>

          <form className='d-flex me-3' role='search'>
            <input
              className='form-control me-2'
              type='search'
              placeholder='Search...'
              aria-label='Search'
            />
          </form>

          <button
            className='btn btn-outline-primary me-2'
            onClick={() => !user && setShowLoginModal(true)}
          >
            <i className='fas fa-user me-1'></i>
            {user ? user.name : 'Login'}
          </button>

          <button className='btn btn-outline-dark'>
            <i className='fas fa-shopping-bag me-1'></i>
            Bag
          </button>
        </div>
      </nav>

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
