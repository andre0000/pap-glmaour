import { useEffect, useState } from 'react';
import './styles.css';
import { useTranslation } from 'react-i18next';
import AddButton from '../../components/addProductButton';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear usuário da sessionStorage:', error);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        console.log('Produtos:', data);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className='profile-background'>
        <img
          src='https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg'
          alt='Background Men'
          className='bg-img'
        />
        <img
          src='https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png'
          alt='Background Women'
          className='bg-img'
        />
      </div>
      <div className='catalog-wrapper'>
        <h2 className='title'>
          {t('title.catalog') || 'Catálogo de Produtos'}
        </h2>

        {user?.is_admin && (
          <div className='add-button-wrapper'>
            <AddButton />
          </div>
        )}

        <div className='product-grid'>
          {products.map((product) => (
            <div key={product.id} className='product-card'>
              <img
                src={product.image}
                alt={product.name}
                className='product-img'
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className='product-price'>
                € {Number(product.price).toFixed(2)}
              </p>
              <button className='btn buy'>{t('buttons.buy')}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
