import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaShoppingBag } from "react-icons/fa";
import "./styles.css";
import LoginModal from "../../modals/loginModal";
import RegisterModal from "../../modals/registerModal";
import profileWhiteIcon from "../../assets/wProfile.svg";
import profileBlackIcon from "../../assets/profile.svg";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../../userContext";
import CartSidebar from "../cartSideBar";
import ShopDropdown from "../../components/shopDropdown";

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
  const { t, i18n } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isLogged = !!user;
  const isCheckoutPage = location.pathname === "/checkout";
  const isAdminSettingsPage = location.pathname === "/admin-settings";

  useEffect(() => {}, [isLogged, user, location.pathname]);

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

  const handleShopClick = () => {
    setShopOpen((prev) => !prev);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg custom-navbar sticky-top`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="container-fluid d-flex justify-content-between align-items-center"
          style={{ position: "relative" }}
        >
          <div
            className="navbar-brand minimal-brand"
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              pointerEvents: "none",
            }}
            tabIndex={-1}
          >
            Glamour
          </div>

          <div className="navbar-left d-flex align-items-center gap-4 position-relative">
            <div
              className="shop-dropdown-wrapper"
              onMouseEnter={handleShopEnter}
              onMouseLeave={handleShopLeave}
              style={{ position: "relative" }}
            >
              <button
                className="btn btn-icon dropdown-toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded={shopOpen}
                onClick={handleShopClick}
              >
                {t("buttons.shop")}
              </button>

              {shopOpen && (
                <div
                  className="dropdown-menu show mt-2 shop-dropdown-menu"
                  style={{ position: "absolute", top: "100%", left: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShopDropdown />
                </div>
              )}
            </div>
          </div>

          <div className="navbar-center"></div>

          <div className="navbar-right d-flex align-items-center position-relative">
            <div className="language-toggle ms-3">
              <button
                className={`lang-toggle ${
                  i18n.language === "pt" ? "pt" : "en"
                }`}
                onClick={() =>
                  changeLanguage(i18n.language === "en" ? "pt" : "en")
                }
                aria-label="Toggle Language"
              >
                <span className="label-en">EN</span>
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
                <span className="label-pt">PT</span>
              </button>
            </div>
            <button
              className="btn btn-icon profile-btn"
              title="Profile"
              aria-label="User profile"
              onClick={() => {
                if (isLogged) {
                  navigate("/profile");
                } else {
                  setIsLoginOpen(true);
                }
              }}
            >
              <img
                src={
                  isLogged
                    ? JSON.parse(sessionStorage.getItem("user"))?.pfp
                    : isHovered
                    ? profileBlackIcon
                    : profileWhiteIcon
                }
                alt="Profile"
                className={isLogged ? "navbar-pfp-img" : "icon-img"}
              />
            </button>

            <button
              className="btn btn-icon bag-btn"
              title="Bag"
              aria-label="Shopping bag"
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
