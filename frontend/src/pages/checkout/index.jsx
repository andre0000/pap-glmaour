import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import CountrySelect from '../../components/countrySelect';
import Select from 'react-select';
import { FaCcVisa } from 'react-icons/fa';
import { CiBank } from 'react-icons/ci';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const CheckoutPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartmentSuite: '',
    city: '',
    postal: '',
    phoneNumber: '',
    payment: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    mbwayNumber: '',
  });
  const [country, setCountry] = useState('PT');

  const paymentOptions = [
    {
      value: 'mbway',
      label: (
        <>
          <CiBank style={{ width: 20, height: 20, marginRight: 8 }} />
          MB Way
        </>
      ),
    },
    {
      value: 'visa',
      label: (
        <>
          <FaCcVisa style={{ width: 20, height: 20, marginRight: 8 }} />
          Visa
        </>
      ),
    },
  ];

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;

    axios
      .get(`/cart/${user.id}`)
      .then((res) => {
        setCartItems(res.data.items || []);
      })
      .catch(() => setCartItems([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostalCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4, 7); // Adiciona o "-"
    }
    setForm({ ...form, postal: value });
  };

  const handleValidation = () => {
    if (step === 1) {
      return (
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.address.trim() &&
        form.city.trim() &&
        form.postal.trim() &&
        form.phoneNumber.trim()
      );
    }
    if (step === 2) {
      if (form.payment === 'visa') {
        return (
          form.cardNumber.trim() &&
          form.cardName.trim() &&
          form.cardExpiry.trim() &&
          form.cardCVC.trim()
        );
      }
      if (form.payment === 'mbway') {
        return form.mbwayNumber.trim();
      }
    }
    return true;
  };

  const handleInputValidation = (e, type) => {
    const value = e.target.value;
    if (type === 'text' && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (type === 'number' && !/^\d*$/.test(value)) return;
    handleChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Compra Realizada!',
      text: `Compra realizado com sucesso!`,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/'); // Redirect to the landing page
    });
  };

  return (
    <div className='checkout-container'>
      <div className='checkout-left'>
        <h2 className='checkout-title'>Glamour</h2>

        {/* Step progress visual */}
        <div className='step-progress'>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`step ${step === s ? 'active' : ''} ${
                step > s ? 'completed' : ''
              }`}
              style={{
                backgroundColor:
                  step === s ? '#000' : step > s ? '#000' : 'transparent',
                color: step === s || step > s ? '#fff' : '#000',
                border: step > s || step === s ? 'none' : '2px solid #000',
              }}
            >
              {s === 1 && '1. Envio'}
              {s === 2 && '2. Pagamento'}
              {s === 3 && '3. Confirmar'}
            </div>
          ))}
        </div>

        <form className='checkout-form' onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h4 className='section-title'>Dados de Envio</h4>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <label className='form-label'>Primeiro Nome</label>
                  <input
                    type='text'
                    name='firstName'
                    value={form.firstName}
                    onChange={(e) => handleInputValidation(e, 'text')}
                    required
                  />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Último Nome</label>
                  <input
                    type='text'
                    name='lastName'
                    value={form.lastName}
                    onChange={(e) => handleInputValidation(e, 'text')}
                    required
                  />
                </div>
                <div className='col-md-12'>
                  <label className='form-label'>Endereço</label>
                  <input
                    type='text'
                    name='address'
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='col-md-8'>
                  <label className='form-label'>Apartamento/Suite</label>
                  <input
                    type='text'
                    name='apartmentSuite'
                    value={form.apartmentSuite}
                    onChange={handleChange}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>Número de Telefone</label>
                  <input
                    type='text'
                    name='phoneNumber'
                    value={form.phoneNumber}
                    onChange={(e) => handleInputValidation(e, 'number')}
                    required
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>Cidade</label>
                  <input
                    type='text'
                    name='city'
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>Código Postal</label>
                  <input
                    type='text'
                    name='postal'
                    value={form.postal}
                    onChange={handlePostalCodeChange}
                    maxLength={8}
                    required
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>País</label>
                  <CountrySelect
                    className='CountrySelect'
                    value={country}
                    onChange={setCountry}
                  />
                </div>
                <div className='col-12'>
                  <button
                    type='button'
                    className='btn btn-dark w-100 mt-3'
                    onClick={() => handleValidation() && setStep(2)}
                    disabled={!handleValidation()}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h4 className='section-title'>Método de Pagamento</h4>
              <div className='row g-3'>
                <div className='col-12'>
                  <label className='form-label'>Método de Pagamento</label>
                  <Select
                    options={paymentOptions}
                    onChange={(selectedOption) =>
                      setForm({ ...form, payment: selectedOption.value })
                    }
                    placeholder='Selecione...'
                  />
                </div>

                {form.payment === 'visa' && (
                  <>
                    <div className='col-md-6'>
                      <label>Número do Cartão</label>
                      <input
                        type='text'
                        name='cardNumber'
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='col-md-6'>
                      <label>Nome no Cartão</label>
                      <input
                        type='text'
                        name='cardName'
                        value={form.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='col-md-6'>
                      <label>Validade</label>
                      <input
                        type='text'
                        name='cardExpiry'
                        placeholder='MM/AA'
                        value={form.cardExpiry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='col-md-6'>
                      <label>CVC</label>
                      <input
                        type='text'
                        name='cardCVC'
                        value={form.cardCVC}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                {form.payment === 'mbway' && (
                  <div className='col-md-6'>
                    <label>Número MB Way</label>
                    <input
                      type='text'
                      name='mbwayNumber'
                      value={form.mbwayNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className='col-12'>
                  <div className='button-row'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </button>
                    <button
                      type='button'
                      className='btn btn-dark'
                      onClick={() => handleValidation() && setStep(3)}
                      disabled={!handleValidation()}
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h4 className='section-title'>Confirmar e Finalizar</h4>
              <div className='summary-box'>
                <p>
                  <strong>Nome:</strong> {form.firstName} {form.lastName}
                </p>
                <p>
                  <strong>Endereço:</strong> {form.address},{' '}
                  {form.apartmentSuite}, {form.city}, {form.postal}, {country}
                </p>
                <p>
                  <strong>Telefone:</strong> {form.phoneNumber}
                </p>
                <p>
                  <strong>Pagamento:</strong> {form.payment.toUpperCase()}
                </p>
                {form.payment === 'mbway' && (
                  <p>
                    <strong>MB Way:</strong> {form.mbwayNumber}
                  </p>
                )}
              </div>

              <div className='col-12'>
                <div className='button-row'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </button>
                  <button type='submit' className='btn btn-success'>
                    Confirmar Compra
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      <div className='checkout-right'>
        <h3 className='cart-title'>Produtos no Carrinho</h3>
        <div className='cart-items'>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className='cart-item'>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <div>
                  <div className='fw-bold'>{item.name}</div>
                  <div className='text-muted'>Size: {item.size}</div>
                  <div className='text-primary'>{item.price}€</div>
                </div>
              </div>
            ))
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
