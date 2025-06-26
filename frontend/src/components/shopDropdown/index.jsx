import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { useTranslation } from 'react-i18next';

const ShopDropdown = () => {
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTypesAndSubTypes = async () => {
      try {
        const typesResponse = await fetch('http://localhost:5000/api/types');
        const subTypesResponse = await fetch(
          'http://localhost:5000/api/subTypes'
        );

        if (!typesResponse.ok || !subTypesResponse.ok) {
          throw new Error('Erro ao buscar os dados');
        }

        const typesData = await typesResponse.json();
        const subTypesData = await subTypesResponse.json();

        console.log('Tipos recebidos:', typesData);
        console.log('Subtipos recebidos:', subTypesData);

        const processedTypes = typesData.map((type) => ({
          ...type,
          sub_types: subTypesData.filter(
            (subType) => subType.type_id === type.id
          ),
        }));

        setTypes(processedTypes);
      } catch (error) {
        console.error('Erro ao buscar os types e sub_types:', error);
      }
    };

    fetchTypesAndSubTypes();
  }, []);

  return (
    <div className='shop-dropdown container-fluid px-0'>
      <div className='shop-dropdown-inner row mx-0'>
        {/* Coluna esquerda com filtros */}
        <div className='dropdown-col col-12 col-md-2 mb-3'>
          <Link
            to='/catalog?filter=new_arrivals'
            className='type-link d-block mb-2 fw-bold'
          >
            {t('title.newArrivals')}
          </Link>
          <Link
            to='/catalog?filter=most_popular'
            className='type-link d-block fw-bold'
          >
            {t('title.bestSellers')}
          </Link>
        </div>

        {/* Colunas dinâmicas para os tipos */}
        {types.map((type) => (
          <div key={type.id} className='dropdown-col col-6 col-md-2 mb-3'>
            <Link
              to={`/catalog?type_id=${type.id}`}
              className='type-link d-block fw-semibold mb-2 text-uppercase small'
            >
              {type.name}
            </Link>
            <div className='sub-types'>
              {type.sub_types.map((subType) => (
                <Link
                  key={subType.id}
                  to={`/catalog?sub_type_id=${subType.id}`}
                  className='sub-type-link d-block text-muted small mb-1'
                >
                  {subType.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopDropdown;
