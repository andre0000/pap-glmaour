import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaShoppingBag, FaBars } from 'react-icons/fa';
import './styles.css';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal'; // importe o registerModal
import profileWhiteIcon from '../../assets/wProfile.svg';
import profileBlackIcon from '../../assets/profile.svg';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoginSuccess = (user) => {
    console.log('Login bem-sucedido:', user);
  };

  const handleRegisterSuccess = (user) => {
    console.log('Registro bem-sucedido:', user);
  };

  // Abrir registro e fechar login
  const openRegisterFromLogin = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // Abrir login e fechar registro (caso queira permitir essa troca)
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
            <a className='navbar-brand minimal-brand' href='/'>
              Glamour
            </a>
          </div>

          <div className='navbar-right d-flex align-items-center gap-3'>
            <form className='search-form d-flex align-items-center'>
              <input
                className='form-control form-control-sm minimal-search'
                type='search'
                placeholder='Search'
                aria-label='Search'
              />
              <button className='btn btn-sm search-btn' type='submit'>
                <FaSearch />
              </button>
            </form>

            <button
              className='btn btn-icon'
              title='Profile'
              onClick={() => {
                setIsRegisterOpen(false); // Fecha a modal de registro, se estiver aberta
                setIsLoginOpen(true); // Abre a modal de login
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
          onOpenRegister={openRegisterFromLogin} // Passa para abrir o registro da modal login
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onLoginSuccess={handleRegisterSuccess}
          onOpenLogin={openLoginFromRegister} // Caso queira trocar do registro para o login
        />
      )}
    </>
  );
};

export default Navbar;
