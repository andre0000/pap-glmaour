import { useState } from "react";
import "./styles.css";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="forgot-modal-backdrop" onClick={onClose}>
      <div
        className="forgot-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="forgot-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="forgot-modal-title">Recuperar Palavra-Passe</h2>

        {submitted ? (
          <p
            style={{ textAlign: "center", color: "#151717", fontWeight: "500" }}
          >
            Email de recuperação enviado!
          </p>
        ) : (
          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="forgot-input"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="forgot-button-submit">
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
