import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import ProfilePage from "./pages/profile";
import NavBar from "./components/navbar";
import NavbarInfo from "./components/navbarInfo";
import MenuSidebar from "./components/menuSidebar";
import LoginModal from "./modals/loginModal";
import RegisterModal from "./modals/registerModal";
import CatalogPage from "./pages/catalog";
import { UserProvider, UserContext } from "../userContext";
import ResetPasswordPage from "./pages/resetPassword";
import CartSidebar from "./components/cartSideBar";
import HomeButton from "./components/homeButton";

function AppContent() {
  const {
    user,
    isLoginOpen,
    setIsLoginOpen,
    isRegisterOpen,
    setIsRegisterOpen,
    handleLoginSuccess,
  } = useContext(UserContext);

  return (
    <>
      <NavbarInfo
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />
      <NavBar />
      <MenuSidebar />
      <CartSidebar />
      <HomeButton />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>

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
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
