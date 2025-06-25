import { useState, useEffect } from 'react';
import './styles.css';
import { useTranslation } from 'react-i18next';

const AddProductModal = ({ show, handleClose }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    gender: '',
    supplier_id: '',
    image: '',
    type: '',
    subType: '',
  });

  const [suppliers, setSuppliers] = useState([]);
  const [imageMode, setImageMode] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/suppliers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setSuppliers(data);
        } else {
          console.error('Erro ao buscar fornecedores:', data.message);
        }
      } catch (err) {
        console.error('Erro de conexão ao buscar fornecedores:', err);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/types');
        const data = await response.json();
        if (response.ok) {
          setTypes(data);
        } else {
          console.error('Erro ao buscar tipos:', data.message);
        }
      } catch (err) {
        console.error('Erro de conexão ao buscar tipos:', err);
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setForm({ ...form, type: selectedType, subType: '' });

    const selectedTypeObj = types.find((type) => type.id === selectedType);
    setSubTypes(selectedTypeObj ? selectedTypeObj.subTypes : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');

    try {
      let requestBody;
      let headers;

      if (imageMode === 'upload' && imageFile) {
        requestBody = new FormData();
        requestBody.append('name', form.name);
        requestBody.append('description', form.description);
        requestBody.append('price', form.price);
        requestBody.append('stock', form.stock);
        requestBody.append('gender', form.gender);
        requestBody.append('supplier_id', form.supplier_id);
        requestBody.append('type', form.type);
        requestBody.append('subType', form.subType);
        requestBody.append('image', imageFile);

        headers = {
          Authorization: `Bearer ${token}`,
        };
      } else {
        requestBody = JSON.stringify(form);
        headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers,
        body: requestBody,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Produto adicionado com sucesso!');
        handleClose();
        window.location.reload();
      } else {
        alert(data.message || 'Erro ao adicionar produto.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  if (!show) return null;

  return (
    <div className='add-product-modal-backdrop' onClick={handleClose}>
      <div
        className='add-product-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='add-product-modal-close' onClick={handleClose}>
          ×
        </button>
        <form className='add-product-form' onSubmit={handleSubmit}>
          <h2 className='add-product-title'>Adicionar Produto</h2>

          <div className='flex-column'>
            <label>{t('label.name')}</label>
            <div className='inputForm'>
              <input
                type='text'
                name='name'
                className='input'
                placeholder={t('placeholder.name')}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.description')}</label>
            <div className='inputForm'>
              <input
                type='text'
                name='description'
                className='input'
                placeholder={t('placeholder.description')}
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.price')}</label>
            <div className='inputForm'>
              <input
                type='number'
                step='0.01'
                name='price'
                className='input'
                placeholder={t('placeholder.price')}
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.gender')}</label>
            <div className='inputForm'>
              <select
                name='gender'
                className='input'
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value=''>{t('options.gender')}</option>
                <option value='male'>{t('options.male')}</option>
                <option value='female'>{t('options.female')}</option>
              </select>
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.stock')}</label>
            <div className='inputForm'>
              <input
                type='number'
                name='stock'
                className='input'
                placeholder={t('placeholder.stock')}
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>Fornecedor</label>
            <div className='inputForm'>
              <select
                name='supplier_id'
                className='input'
                value={form.supplier_id}
                onChange={handleChange}
                required
              >
                <option value=''>{t('options.supplier')}</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.type')}</label>
            <div className='inputForm'>
              <select
                name='type'
                className='input'
                value={form.type || ''}
                onChange={handleTypeChange}
                required
              >
                <option value=''>{t('options.type')}</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.subType')}</label>
            <div className='inputForm'>
              <select
                name='subType'
                className='input'
                value={form.subType || ''}
                onChange={(e) => setForm({ ...form, subType: e.target.value })}
                required
              >
                <option value=''>{t('options.subType')}</option>
                {subTypes.map((subType) => (
                  <option key={subType.id} value={subType.id}>
                    {subType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex-column'>
            <label>{t('label.image')}</label>
            <div className='image-mode-toggle'>
              <button
                type='button'
                onClick={() => setImageMode('url')}
                className={imageMode === 'url' ? 'active' : ''}
              >
                {t('button.imageUrl')}
              </button>
              <button
                type='button'
                onClick={() => setImageMode('upload')}
                className={imageMode === 'upload' ? 'active' : ''}
              >
                {t('button.imageUpload')}
              </button>
            </div>

            {imageMode === 'url' ? (
              <div className='inputForm'>
                <input
                  type='text'
                  name='image'
                  className='input'
                  placeholder={t('placeholder.urlImage')}
                  value={form.image}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className='inputForm'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          <button className='button-submit' type='submit'>
            {t('button.addProduct')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
