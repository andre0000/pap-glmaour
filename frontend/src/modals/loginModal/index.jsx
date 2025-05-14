import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import LoginModal from './modals/LoginModal'; // Importe o LoginModal
import './styles.css';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar se o usuário está logado (exemplo usando sessionStorage)
  const checkUserLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    const loggedUser = sessionStorage.getItem('user');
    if (token && loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  };

  // Chamar essa função no useEffect ou em algum lugar para verificar o login
  React.useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const handleOpenModal = () => {
    if (!user) {
      setIsModalOpen(true); // Abre a modal se o usuário não estiver logado
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha a modal
  };

  const handleLoginSuccess = (user) => {
    setUser(user); // Salva o usuário logado
  };

  const handleOpenRegister = () => {
    // Lógica para abrir a tela de registro
  };

  return (
    <nav className='navbar navbar-expand-lg custom-navbar'>
      <div className='container-fluid d-flex justify-content-between align-items-center'>
        <a className='navbar-brand minimal-brand' href='#'>
          Glamour
        </a>

        <div className='d-flex align-items-center gap-3'>
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
            onClick={handleOpenModal} // Abre a modal quando clicar
          >
            {user ? (
              <span>{user.name}</span> // Exibe o nome do usuário se estiver logado
            ) : (
              <FaUser />
            )}
          </button>

          <button className='btn btn-icon' title='Bag'>
            <FaShoppingBag />
          </button>
        </div>
      </div>

      {/* Modal de login */}
      {isModalOpen && (
        <LoginModal
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={handleOpenRegister}
        />
      )}
    </nav>
  );
};

export default Navbar;
