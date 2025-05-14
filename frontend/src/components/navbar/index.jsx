import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSearch, FaUser, FaShoppingBag } from 'react-icons/fa';
import './styles.css';

const Navbar = () => {
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
