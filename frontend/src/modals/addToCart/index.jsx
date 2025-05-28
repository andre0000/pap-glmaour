import "./styles.css";

const AddToCartModal = ({ product, show, handleClose }) => {
  if (!show) return null;

  const sizes = ["XS", "S", "M", "L", "XL"];
  const handleAddToCart = (size) => {
    console.log(`Adicionar ${product.name} tamanho ${size} ao carrinho`);
    handleClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="size-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} className="modal-img" />
        <div className="sizes">
          {sizes.map((size) => (
            <button key={size} onClick={() => handleAddToCart(size)}>
              {size}
            </button>
          ))}
        </div>
        <button className="close-btn" onClick={handleClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
