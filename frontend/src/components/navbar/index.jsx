import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaShoppingBag, FaBars } from 'react-icons/fa';
import './styles.css';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal';
import profileWhiteIcon from '../../assets/wProfile.svg';
import profileBlackIcon from '../../assets/profile.svg';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pfp, setPfp] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setIsLogged(true);

      if (user.pfp && user.pfp.trim() !== '') {
        setPfp(user.pfp);
      } else {
        setPfp(null);
      }
    } else {
      setIsLogged(false);
      setPfp(null);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    console.log('Login bem-sucedido:', user);
    setIsLogged(true);
    if (user.pfp && user.pfp.trim() !== '') {
      setPfp(user.pfp);
    } else {
      setPfp(null);
    }
  };

  const handleRegisterSuccess = (user) => {
    console.log('Registro bem-sucedido:', user);
    setIsLogged(true);
    if (user.pfp && user.pfp.trim() !== '') {
      setPfp(user.pfp);
    } else {
      setPfp(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsLogged(false);
    setPfp(null);
    setShowDropdown(false);
    navigate('/');
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

            <div className='dropdown position-relative'>
              <button
                className='btn btn-icon'
                title='Profile'
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {isLogged && pfp ? (
                  <img src={pfp} alt='Profile' className='pfp-img' />
                ) : (
                  <img
                    src={isHovered ? profileBlackIcon : profileWhiteIcon}
                    alt='Profile'
                    className='icon-img'
                  />
                )}
              </button>

              {showDropdown && (
                <div
                  className='dropdown-menu show position-absolute end-0 mt-2'
                  style={{ minWidth: '160px' }}
                >
                  <button
                    className='dropdown-item'
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                  >
                    {t('dropdown.profile')}
                  </button>
                  {JSON.parse(sessionStorage.getItem('user'))?.is_admin && (
                    <button
                      className='dropdown-item'
                      onClick={() => {
                        navigate('/admin/settings');
                        setShowDropdown(false);
                      }}
                    >
                      {t('dropdown.adminsettings')}
                    </button>
                  )}
                  <button
                    className='dropdown-item text-danger'
                    onClick={handleLogout}
                  >
                    {t('dropdown.logout')}
                  </button>
                </div>
              )}
            </div>

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
          onOpenRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onLoginSuccess={handleRegisterSuccess}
          onOpenLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
