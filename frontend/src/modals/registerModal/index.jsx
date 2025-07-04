import React, { useState } from "react";
import "./styles.css";
import { useTranslation } from "react-i18next";

const RegisterModal = ({ onClose, onLoginSuccess, onOpenLogin }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.code
          ? t(`error.${data.code}`)
          : t("error.register_failed");
        throw new Error(errorMsg);
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.pfp) {
        sessionStorage.setItem("pfp", data.user.pfp);
      } else {
        sessionStorage.removeItem("pfp");
      }

      setSuccess("Conta criada com sucesso!");
      if (onLoginSuccess) onLoginSuccess(data.user);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-modal-backdrop" onClick={onClose}>
      <div
        className="register-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 style={{ marginBottom: "20px" }}>{t("title.createAccount")}</h2>

        {error && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">{success}</div>}

        <form className="form" onSubmit={handleRegister}>
          <div className="flex-column">
            <label>{t("label.name")}</label>
          </div>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="0 0 24 24"
              width="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            </svg>
            <input
              type="text"
              className="input"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex-column">
            <label>{t("label.email")}</label>
          </div>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="0 0 32 32"
              width="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8v16h24V8H4z"></path>
              <polyline points="4 8 16 18 28 8"></polyline>
            </svg>
            <input
              type="email"
              className="input"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-column">
            <label>{t("label.password")}</label>
          </div>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="0 0 24 24"
              width="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="button-submit" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="p">
          {t("span.signIn")}
          <span
            className="span"
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
            }}
            style={{ cursor: "pointer" }}
          >
            {t("span.signInLink")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
