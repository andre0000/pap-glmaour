import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const { t } = useTranslation();

  const isLogged = !!user;

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    updateUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg custom-navbar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="navbar-left d-flex align-items-center gap-4">
            <button
              className="btn btn-icon"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-controls="offcanvasMenu"
              title="Menu"
            >
              <FaBars />
            </button>
          </div>

          <div className="navbar-center">
            <Link className="navbar-brand minimal-brand" to="/">
              Glamour
            </Link>
          </div>

          <div className="navbar-right d-flex align-items-center gap-3">
            <form className="search-form d-flex align-items-center">
              <input
                className="form-control form-control-sm minimal-search"
                type="search"
                placeholder={t("input.search")}
                aria-label={t("input.search")}
              />
              <button className="btn btn-sm search-btn" type="submit">
                <FaSearch />
              </button>
            </form>

            <div className="dropdown position-relative">
              <button
                className="btn btn-icon"
                title="Profile"
                onClick={() => {
                  if (isLogged) {
                    setShowDropdown(!showDropdown);
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
              >
                {isLogged && user?.pfp ? (
                  <img src={user.pfp} alt="Profile" className="pfp-img" />
                ) : (
                  <img
                    src={isHovered ? profileBlackIcon : profileWhiteIcon}
                    alt="Profile"
                    className="icon-img"
                  />
                )}
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu show position-absolute end-0 mt-2"
                  style={{ minWidth: "160px" }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
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
                    >
                      {t("dropdown.adminsettings")}
                    </button>
                  )}
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    {t("dropdown.logout")}
                  </button>
                </div>
              )}
            </div>

            <button className="btn btn-icon" title="Bag">
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
    </>
  );
};

export default Navbar;
