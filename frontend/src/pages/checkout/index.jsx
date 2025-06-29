import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import CountrySelect from "../../components/countrySelect";
import Select from "react-select";
import { FaCcVisa } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CheckoutPage = (isOpen) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartmentSuite: "",
    city: "",
    postal: "",
    phoneNumber: "",
    payment: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
    mbwayNumber: "",
  });
  const [country, setCountry] = useState("PT");

  const paymentOptions = [
    {
      value: "mbway",
      label: (
        <>
          <CiBank style={{ width: 20, height: 20, marginRight: 8 }} />
          MB Way
        </>
      ),
    },
    {
      value: "visa",
      label: (
        <>
          <FaCcVisa style={{ width: 20, height: 20, marginRight: 8 }} />
          Visa
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) return;

    setUser(storedUser);
    fetchCartItems(storedUser.id);
  }, [isOpen]);

  const fetchCartItems = (userId) => {
    if (!userId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data.items || []);
      })
      .catch(() => setCartItems([]));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostalCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 7);
    }
    setForm({ ...form, postal: value });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
      if (form.payment === "visa") {
        return (
          form.cardNumber.trim() &&
          form.cardName.trim() &&
          form.cardExpiry.trim() &&
          form.cardCVC.trim()
        );
      }
      if (form.payment === "mbway") {
        return form.mbwayNumber.trim();
      }
    }
    return true;
  };

  const handleInputValidation = (e, type) => {
    const value = e.target.value;
    if (type === "text" && !/^[\p{L}\s'-]+$/u.test(value)) return;
    if (type === "number" && !/^\d*$/.test(value)) return;
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${user.id}/checkout`
      );

      Swal.fire({
        title: t("checkout.messages.purchaseSuccessTitle"),
        text: t("checkout.messages.purchaseSuccessText"),
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Erro ao confirmar a compra:", error);
      Swal.fire({
        title: t("checkout.messages.purchaseFailedTitle"),
        text: t("checkout.messages.purchaseFailedText"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <h2 className="checkout-title">Glamour</h2>

        <div className="step-progress">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`step ${step === s ? "active" : ""} ${
                step > s ? "completed" : ""
              }`}
              style={{
                backgroundColor:
                  step === s ? "#000" : step > s ? "#000" : "transparent",
                color: step === s || step > s ? "#fff" : "#000",
                border: step > s || step === s ? "none" : "2px solid #000",
              }}
            >
              {t(`checkout.steps.${s}`)}
            </div>
          ))}
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h4 className="section-title">
                {t("checkout.sectionTitle.shippingData")}
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    {t("checkout.labels.firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={(e) => handleInputValidation(e, "text")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    {t("checkout.labels.lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={(e) => handleInputValidation(e, "text")}
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">
                    {t("checkout.labels.address")}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label">
                    {t("checkout.labels.apartmentSuite")}
                  </label>
                  <input
                    type="text"
                    name="apartmentSuite"
                    value={form.apartmentSuite}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {t("checkout.labels.phoneNumber")}
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={(e) => handleInputValidation(e, "number")}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {t("checkout.labels.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {t("checkout.labels.postalCode")}
                  </label>
                  <input
                    type="text"
                    name="postal"
                    value={form.postal}
                    onChange={handlePostalCodeChange}
                    maxLength={8}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {t("checkout.labels.country")}
                  </label>
                  <CountrySelect
                    className="CountrySelect"
                    value={country}
                    onChange={setCountry}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-dark w-100 mt-3"
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
              <h4 className="section-title">
                {t("checkout.sectionTitle.paymentMethod")}
              </h4>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">
                    {t("checkout.labels.paymentMethod")}
                  </label>
                  <Select
                    options={paymentOptions}
                    onChange={(selectedOption) =>
                      setForm({ ...form, payment: selectedOption.value })
                    }
                    placeholder="Selecione..."
                  />
                </div>

                {form.payment === "visa" && (
                  <>
                    <div className="col-md-6">
                      <label>{t("checkout.labels.cardNumber")}</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>{t("checkout.labels.cardName")}</label>
                      <input
                        type="text"
                        name="cardName"
                        value={form.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>{t("checkout.labels.cardExpiry")}</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/AA"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>{t("checkout.labels.cardCVC")}</label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={form.cardCVC}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                {form.payment === "mbway" && (
                  <div className="col-md-6">
                    <label>{t("checkout.labels.mbwayNumber")}</label>
                    <input
                      type="text"
                      name="mbwayNumber"
                      value={form.mbwayNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="col-12">
                  <div className="button-row">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      {t("checkout.buttons.back")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleValidation() && setStep(3)}
                      disabled={!handleValidation()}
                    >
                      {t("checkout.buttons.next")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h4 className="section-title">
                {t("checkout.sectionTitle.confirmFinish")}
              </h4>
              <div className="summary-box">
                <p>
                  <strong>{t("checkout.labels.name")}:</strong> {form.firstName}{" "}
                  {form.lastName}
                </p>
                <p>
                  <strong>{t("checkout.labels.address")}:</strong>{" "}
                  {form.address}, {form.apartmentSuite}, {form.city},{" "}
                  {form.postal}, {country}
                </p>
                <p>
                  <strong>{t("checkout.labels.phoneNumber")}:</strong>{" "}
                  {form.phoneNumber}
                </p>
                <p>
                  <strong>{t("checkout.labels.paymentType")}:</strong>{" "}
                  {form.payment.toUpperCase()}
                </p>
                {form.payment === "mbway" && (
                  <p>
                    <strong>{t("checkout.labels.paymentTypeMbway")}:</strong>{" "}
                    {form.mbwayNumber}
                  </p>
                )}
              </div>

              <div className="col-12">
                <div className="button-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    {t("checkout.buttons.back")}
                  </button>
                  <button type="submit" className="btn btn-success">
                    {t("checkout.buttons.confirmPurchase")}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="checkout-right">
        <h3 className="cart-title">
          {t("checkout.sectionTitle.productsInCart")}
        </h3>

        {cartItems.length === 0 ? (
          <p>{t("checkout.labels.cartEmpty")}</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={item.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "12px",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div className="cart-item-name" style={{ fontWeight: 600 }}>
                    {item.name}
                  </div>
                  <div className="cart-item-meta text-muted">
                    {item.quantity}x | {t("checkout.labels.size")}: {item.size}
                  </div>
                  <div className="cart-item-price text-primary">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </div>
              </div>
            ))}

            <div
              className="cart-total"
              style={{ marginTop: "20px", fontWeight: "bold" }}
            >
              {t("checkout.labels.totalPrice")}:{" "}
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
              €
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
