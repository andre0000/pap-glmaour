import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaUser, FaShoppingBag, FaBars } from 'react-icons/fa';
import './styles.css';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg custom-navbar'>
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

          <button className='btn btn-icon' title='Profile'>
            <FaUser />
          </button>

          <button className='btn btn-icon' title='Bag'>
            <FaShoppingBag />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
