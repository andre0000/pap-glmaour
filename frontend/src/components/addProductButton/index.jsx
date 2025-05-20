import { useState } from 'react';
import './styles.css';
import AddProductModal from '../../modals/addProduct';

const AddButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <button
        className='add-button'
        onClick={handleOpen}
        title='Adicionar Produto'
      >
        +
      </button>

      <AddProductModal show={showModal} handleClose={handleClose} />
    </>
  );
};

export default AddButton;
