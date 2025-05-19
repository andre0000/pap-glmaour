import React from 'react';
import './styles.css';
import { useTranslation } from 'react-i18next';

const NavbarInfo = () => {
  const { t } = useTranslation();
  return (
    <div className='mini-navbar'>
      <p className='mini-text'>{t('navbarinfo.info')}</p>
    </div>
  );
};

export default NavbarInfo;
