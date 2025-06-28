import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import "./styles.css";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          title: "Palavra-passe redefinida!",
          text: "Agora você pode fazer login com a nova palavra-passe.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Erro",
          text: data.message || "Erro ao redefinir a palavra-passe",
          icon: "error",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Erro:", error);
      Swal.fire({
        title: "Erro inesperado",
        text: "Tente novamente mais tarde.",
        icon: "error",
      });
      navigate("/");
    }
  };

  return (
    <>
      <div className="profile-background">
        <img
          src="https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg"
          alt="Background Men"
          className="bg-img"
        />
        <img
          src="https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png"
          alt="Background Women"
          className="bg-img"
        />
      </div>

      <div className="reset-wrapper">
        <h2 className="reset-title">Redefinir Palavra-Passe</h2>
        <form onSubmit={handleReset} className="reset-form">
          <input
            type="password"
            placeholder="Nova Palavra-Passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Redefinir</button>
        </form>
      </div>
    </>
  );
}
