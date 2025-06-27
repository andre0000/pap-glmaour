import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaShoppingBag } from 'react-icons/fa';
import './styles.css';
import LoginModal from '../../modals/loginModal';
import RegisterModal from '../../modals/registerModal';
import profileWhiteIcon from '../../assets/wProfile.svg';
import profileBlackIcon from '../../assets/profile.svg';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../userContext';
import CartSidebar from '../cartSideBar';
import ShopDropdown from '../../components/shopDropdown';

const Navbar = () => {
  const {
    user,
    updateUser,
    isLoginOpen,
    setIsLoginOpen,
    isRegisterOpen,
    setIsRegisterOpen,
    handleLoginSuccess,
  } = useContext(UserContext);

  const [isHovered, setIsHovered] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopCloseTimeout, setShopCloseTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const isLogged = !!user;
  const isCatalogPage = location.pathname === '/catalog';
  const isCheckoutPage = location.pathname === '/checkout';
  const isAdminSettingsPage = location.pathname === '/admin-settings';

  // LOG: Estado inicial e mudanças
  useEffect(() => {
    console.log('🔍 [NAVBAR] Estado atual:', {
      isLogged,
      user: user ? { id: user.id, name: user.name } : null,
      pathname: location.pathname,
    });
  }, [isLogged, user, location.pathname]); // Removed showDropdown from dependencies

  if (isCheckoutPage) return null;
  if (isCheckoutPage || isAdminSettingsPage) return null;

  const handleShopEnter = () => {
    if (shopCloseTimeout) {
      clearTimeout(shopCloseTimeout);
      setShopCloseTimeout(null);
    }
    setShopOpen(true);
  };

  const handleShopLeave = () => {
    const timeout = setTimeout(() => {
      setShopOpen(false);
    }, 200);
    setShopCloseTimeout(timeout);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg custom-navbar sticky-top ${
          isCatalogPage ? 'catalog-navbar' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className='container-fluid d-flex justify-content-between align-items-center'
          style={{ position: 'relative' }}
        >
          <div
            className='navbar-brand minimal-brand'
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              pointerEvents: 'none',
            }}
            tabIndex={-1}
          >
            Glamour
          </div>

          <div className='navbar-left d-flex align-items-center gap-4 position-relative'>
            <div
              className='shop-dropdown-wrapper'
              onMouseEnter={handleShopEnter}
              onMouseLeave={handleShopLeave}
              style={{ position: 'relative' }}
            >
              <button
                className='btn btn-icon dropdown-toggle'
                type='button'
                aria-haspopup='true'
                aria-expanded={shopOpen}
              >
                {t('buttons.shop')}
              </button>

              {shopOpen && (
                <div
                  className='dropdown-menu show mt-2 shop-dropdown-menu'
                  style={{ position: 'absolute', top: '100%', left: 0 }}
                >
                  <ShopDropdown />
                </div>
              )}
            </div>
          </div>

          <div className='navbar-center'></div>

          <div className='navbar-right d-flex align-items-center gap-3 position-relative'>
            <form
              className='search-form d-flex align-items-center'
              role='search'
            >
              <input
                className='form-control form-control-sm minimal-search'
                type='search'
                placeholder={t('input.search')}
                aria-label={t('input.search')}
              />
              <button
                className='btn btn-sm search-btn'
                type='submit'
                aria-label='Search'
              >
                <FaSearch />
              </button>
            </form>

            <button
              className='btn btn-icon'
              title='Profile'
              aria-label='User profile'
              onClick={() => {
                if (isLogged) {
                  navigate('/profile');
                } else {
                  setIsLoginOpen(true);
                }
              }}
            >
              <img
                src={isHovered ? profileBlackIcon : profileWhiteIcon}
                alt='Profile'
                style={{ width: 30, height: 30 }}
              />
            </button>

            <button
              className='btn btn-icon'
              title='Bag'
              aria-label='Shopping bag'
              onClick={toggleCart}
            >
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
          onLoginSuccess={handleLoginSuccess}
          onOpenLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}

      <CartSidebar isOpen={isCartOpen} toggleCart={toggleCart} />
    </>
  );
};

export default Navbar;
