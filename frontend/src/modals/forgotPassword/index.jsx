import { useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordModal({ onClose }) {
  const { t } = useTranslation();
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
        throw new Error(data.message || t("recovery.error"));
      }

      setSubmitted(true);

      Swal.fire({
        icon: "success",
        title: t("recovery.successTitle"),
        text: t("recovery.successText"),
        confirmButtonText: t("recovery.okButton"),
      });

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
            <h2 style={{ marginBottom: "20px" }}>{t("recovery.title")}</h2>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "20px" }}>{t("recovery.title")}</h2>

            <div className="flex-column">
              <label>{t("recovery.emailLabel")}</label>
            </div>
            <div className="inputForm">
              <input
                type="email"
                className="input"
                placeholder={t("recovery.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" className="button-submit">
              {t("recovery.submitButton")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
