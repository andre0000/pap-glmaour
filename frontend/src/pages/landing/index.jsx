import './styles.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (gender) => {
    navigate(`/catalog?gender=${gender}`);
  };

  return (
    <div className='split-screen'>
      <div className='split left' onClick={() => handleClick('men')}>
        <img
          src='https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg'
          alt='Clothing'
          className='bg-img'
        />
        <div className='overlay-text'>{t('gender.men')}</div>
      </div>
      <div className='split right' onClick={() => handleClick('women')}>
        <img
          src='https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png'
          alt='Boutique'
          className='bg-img'
        />
        <div className='overlay-text'>{t('gender.women')}</div>
      </div>
    </div>
  );
};

export default LandingPage;
