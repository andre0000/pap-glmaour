import { useState, useEffect } from 'react';
import './styles.css';

const AddProductModal = ({ show, handleClose }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    supplier_id: '',
    image: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [suppliers, setSuppliers] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
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
      <div className='add-product-modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='add-product-modal-close' onClick={handleClose}>×</button>
        <form className='add-product-form' onSubmit={handleSubmit}>
          <h2 className='add-product-title'>Adicionar Produto</h2>

          <div className='flex-column'>
            <label>Nome</label>
            <div className='inputForm'>
              <input
                type='text'
                name='name'
                className='input'
                placeholder='Nome do Produto'
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>Descrição</label>
            <div className='inputForm'>
              <input
                type='text'
                name='description'
                className='input'
                placeholder='Descrição do Produto'
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>Preço</label>
            <div className='inputForm'>
              <input
                type='number'
                step='0.01'
                name='price'
                className='input'
                placeholder='Preço'
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='flex-column'>
            <label>Stock</label>
            <div className='inputForm'>
              <input
                type='number'
                name='stock'
                className='input'
                placeholder='Stock'
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
      <option value=''>Selecione um fornecedor</option>
      {suppliers.map((supplier) => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.name}
        </option>
      ))}
    </select>
  </div>
</div>


          <div className='flex-column'>
            <label>URL da Imagem</label>
            <div className='inputForm'>
              <input
                type='text'
                name='image'
                className='input'
                placeholder='https://exemplo.com/imagem.jpg'
                value={form.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className='button-submit' type='submit'>
            Adicionar Produto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
