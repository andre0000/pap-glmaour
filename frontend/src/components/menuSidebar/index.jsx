import React, { useState } from 'react';
import './styles.css';

const menClothes = ['Tops', 'Bottoms', 'Accessories', 'Outerwear', 'Footwear'];

const womenClothes = [
  'Tops',
  'Bottoms',
  'Accessories',
  'Outerwear',
  'Footwear',
];

const MenuSidebar = () => {
  const [activeGender, setActiveGender] = useState('Men');

  const handleGenderClick = (gender) => {
    setActiveGender(gender);
  };

  const clothingItems = activeGender === 'Men' ? menClothes : womenClothes;

  return (
    <div
      className='offcanvas offcanvas-start offcanvas-fullscreen'
      tabIndex='-1'
      id='offcanvasMenu'
      aria-labelledby='offcanvasMenuLabel'
    >
      <div className='offcanvas-header d-flex justify-content-between align-items-center'>

        <button
          type='button'
          className='btn-close'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
        ></button>
      </div>

      {/* Separador Men / Women */}
      <div className='gender-tabs d-flex justify-content-center border-bottom mb-3'>
        <button
          className={`gender-tab ${activeGender === 'Men' ? 'active' : ''}`}
          onClick={() => handleGenderClick('Men')}
        >
          Men
        </button>
        <button
          className={`gender-tab ${activeGender === 'Women' ? 'active' : ''}`}
          onClick={() => handleGenderClick('Women')}
        >
          Women
        </button>
      </div>

      {/* Lista de tipos de roupa alinhada à esquerda e no canto inferior */}
      <div className='offcanvas-body'>
        <ul className='clothing-list'>
          {clothingItems.map((item) => (
            <li key={item}>
              <a href='#' className='nav-link'>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuSidebar;
