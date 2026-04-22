"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/password";

export function NovaSenhaForm() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const token = sessionStorage.getItem("resetToken");
    if (!token) {
      setError("Código de recuperação não encontrado. Solicite um novo código.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, novaSenha);
      sessionStorage.removeItem("resetToken");
      sessionStorage.removeItem("resetEmail");
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Crie a nova senha
          </label>

          <input
            type="password"
            id="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            className="bg-white border border-gray-300 mb-1 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite sua nova senha"
          />
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Confirme a nova senha
          </label>

          <input
            type="password"
            id="confirmPassword"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="bg-white border border-gray-300 mb-3 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite sua nova senha"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2 font-poppins">{error}</p>}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Redefinindo..." : "Redefinir a senha"}
          </button>
        </div>
      </form>
    </div>
  );
}