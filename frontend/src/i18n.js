import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locale/en';
import ptTranslation from './locale/pt';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    pt: {
      translation: ptTranslation,
    },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
