import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
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
        window.location.reload(); // Recarrega para ver produto novo
      } else {
        alert(data.message || 'Erro ao adicionar produto.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Produto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className='mb-2'>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name='name'
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              name='description'
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Preço</Form.Label>
            <Form.Control
              type='number'
              step='0.01'
              name='price'
              value={form.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type='number'
              name='stock'
              value={form.stock}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>ID do Fornecedor</Form.Label>
            <Form.Control
              name='supplier_id'
              value={form.supplier_id}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>URL da Imagem</Form.Label>
            <Form.Control
              name='image'
              value={form.image}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' variant='primary'>
            Adicionar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
