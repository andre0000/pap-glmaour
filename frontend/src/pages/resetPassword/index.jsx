import { useParams } from "react-router-dom";
import { useState } from "react";
import "./styles.css";

export default function ResetPasswordPage() {
  const { token } = useParams(); // pega o token da URL
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Senha redefinida com sucesso!");
        // redirecionar para login, por exemplo
      } else {
        alert(data.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="reset-container">
      <h2>Redefinir Palavra-Passe</h2>
      <form onSubmit={handleReset}>
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
  );
}
