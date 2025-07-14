import { useState } from "react";
import "./styles.css";
import ForgotPasswordModal from "../forgotPassword";
import { useTranslation } from "react-i18next";

const LoginModal = ({ onClose, onLoginSuccess, onOpenRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.code
          ? t(`error.${data.code}`)
          : t("error.login_failed");
        throw new Error(errorMsg);
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.pfp) {
        sessionStorage.setItem("pfp", data.user.pfp);
      } else {
        sessionStorage.removeItem("pfp");
      }

      if (onLoginSuccess) onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgotModal ? (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      ) : (
        <div className="modal-backdrop" onClick={onClose}>
          <div
            className="login-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>
              ×
            </button>

            <form className="form" onSubmit={handleLogin}>
              {error && <div className="modal-error">{error}</div>}
              <h2 style={{ marginBottom: "20px" }}>Login</h2>

              <div className="flex-column">
                <label>{t("label.email")}</label>
              </div>
              <div className="inputForm">
                <input
                  type="email"
                  className="input"
                  placeholder={t("placeholder.enterEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex-column">
                <label>{t("label.password")}</label>
              </div>
              <div className="inputForm">
                <input
                  type="password"
                  className="input"
                  placeholder={t("placeholder.enterPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex-row">
                <span
                  className="span"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    console.log("abrindo forgot modal");
                    setShowForgotModal(true);
                  }}
                >
                  {t("span.forgotPassword")}
                </span>
              </div>

              <button
                className="button-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? t("buttons.signInLoading") : t("buttons.signIn")}
              </button>

              <p className="p">
                {t("span.signUp")}
                <span
                  className="span"
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {t("span.signUpLink")}
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
