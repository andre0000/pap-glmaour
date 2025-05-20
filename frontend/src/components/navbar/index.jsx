import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaShoppingBag, FaBars } from 'react-icons/fa';
import './styles.css';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal';
import profileWhiteIcon from '../../assets/wProfile.svg';
import profileBlackIcon from '../../assets/profile.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginSuccess = (user) => {
    console.log('Login bem-sucedido:', user);
  };

  const handleRegisterSuccess = (user) => {
    console.log('Registro bem-sucedido:', user);
  };

  const openRegisterFromLogin = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openLoginFromRegister = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <nav
        className='navbar navbar-expand-lg custom-navbar'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='container-fluid d-flex justify-content-between align-items-center'>
          <div className='navbar-left d-flex align-items-center gap-4'>
            <button
              className='btn btn-icon'
              type='button'
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasMenu'
              aria-controls='offcanvasMenu'
              title='Menu'
            >
              <FaBars />
            </button>
          </div>

          <div className='navbar-center'>
            <Link className='navbar-brand minimal-brand' to='/'>
              Glamour
            </Link>
          </div>

          <div className='navbar-right d-flex align-items-center gap-3'>
            <form className='search-form d-flex align-items-center'>
              <input
                className='form-control form-control-sm minimal-search'
                type='search'
                placeholder={t('input.search')}
                aria-label={t('input.search')}
              />
              <button className='btn btn-sm search-btn' type='submit'>
                <FaSearch />
              </button>
            </form>

            <button
              className='btn btn-icon'
              title='Profile'
              onClick={() => {
                const user = sessionStorage.getItem('user');

                if (user) {
                  navigate('/profile');
                } else {
                  setIsRegisterOpen(false);
                  setIsLoginOpen(true);
                }
              }}
            >
              <img
                src={isHovered ? profileBlackIcon : profileWhiteIcon}
                alt='Profile'
                className='icon-img'
              />
            </button>

            <button className='btn btn-icon' title='Bag'>
              <FaShoppingBag />
            </button>
          </div>
        </div>
      </nav>

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={openRegisterFromLogin}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onLoginSuccess={handleRegisterSuccess}
          onOpenLogin={openLoginFromRegister}
        />
      )}
    </>
  );
};

export default Navbar;
