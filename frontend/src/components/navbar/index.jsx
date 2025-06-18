import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaSearch, FaShoppingBag, FaBars } from "react-icons/fa";
import "./styles.css";
import LoginModal from "../../modals/loginModal";
import RegisterModal from "../../modals/registerModal";
import profileWhiteIcon from "../../assets/wProfile.svg";
import profileBlackIcon from "../../assets/profile.svg";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../../userContext";
import CartSidebar from "../cartSideBar";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const isLogged = !!user;
  const isCatalogPage = location.pathname === "/catalog";

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    updateUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    if (isLogged) {
      setShowDropdown((prev) => !prev);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg custom-navbar sticky-top ${
          isCatalogPage ? "catalog-navbar" : ""
        }`}
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

          <div className="navbar-left d-flex align-items-center gap-4">
            <button
              className="btn btn-icon"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-controls="offcanvasMenu"
              aria-label="Open menu"
              title="Menu"
            >
              <FaBars />
            </button>
          </div>

          <div className="navbar-center"></div>

          <div className="navbar-right d-flex align-items-center gap-3">
            <form
              className="search-form d-flex align-items-center"
              role="search"
            >
              <input
                className="form-control form-control-sm minimal-search"
                type="search"
                placeholder={t("input.search")}
                aria-label={t("input.search")}
              />
              <button
                className="btn btn-sm search-btn"
                type="submit"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>

            <div className="dropdown position-relative">
              <button
                className="btn btn-icon"
                title="Profile"
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={toggleDropdown}
              >
                {isLogged && user?.pfp ? (
                  <img src={user.pfp} alt="Profile" className="pfp-img" />
                ) : (
                  <img
                    src={
                      isCatalogPage || isHovered
                        ? profileBlackIcon
                        : profileWhiteIcon
                    }
                    alt="Profile"
                    className="icon-img"
                  />
                )}
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu show position-absolute end-0 mt-2"
                  style={{ minWidth: "160px" }}
                  role="menu"
                >
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    role="menuitem"
                  >
                    {t("dropdown.profile")}
                  </button>
                  {user?.is_admin && (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/admin/settings");
                        setShowDropdown(false);
                      }}
                      role="menuitem"
                    >
                      {t("dropdown.adminsettings")}
                    </button>
                  )}
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    {t("dropdown.logout")}
                  </button>
                </div>
              )}
            </div>

            <button
              className="btn btn-icon"
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
