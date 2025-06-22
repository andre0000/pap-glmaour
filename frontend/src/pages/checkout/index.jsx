import { useState } from "react";
import "./styles.css";
import CountrySelect from "../../components/countrySelect";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    payment: "",
  });

  const [country, setCountry] = useState("PT");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pedido realizado com sucesso! País: ${country}`);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Cidade</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Código Postal</label>
            <input
              type="text"
              className="form-control"
              name="postal"
              value={form.postal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">País</label>
            <CountrySelect value={country} onChange={setCountry} />
          </div>
          <div className="col-12">
            <label className="form-label">Método de Pagamento</label>
            <select
              className="form-select"
              name="payment"
              value={form.payment}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="mbway">MB Way</option>
              <option value="visa">Visa</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-dark mt-4 w-100">
          Finalizar Compra
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;



