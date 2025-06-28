import { useState } from "react";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao enviar email de recuperação.");
      }

      setSubmitted(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {submitted ? (
          <div className="form">
            <h2 style={{ marginBottom: "20px" }}>Recuperar Palavra-Passe</h2>
            <p className="p" style={{ fontWeight: "500" }}>
              Email de recuperação enviado!
            </p>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "20px" }}>Recuperar Palavra-Passe</h2>

            <div className="flex-column">
              <label>Email</label>
            </div>
            <div className="inputForm">
              <input
                type="email"
                className="input"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" className="button-submit">
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
