import './styles.css';

const AddButton = ({ onClick }) => { // Desestruturar onClick das props
  return (
    <>
      <button
        className='add-button'
        onClick={onClick}
        title='Adicionar Produto'
      >
        +
      </button>
    </>
  );
};

export default AddButton;
