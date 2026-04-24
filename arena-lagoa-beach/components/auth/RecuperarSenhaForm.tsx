"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/services/password";

export function RecuperarSenhaForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Digite o código de 6 dígitos enviado ao e-mail.");
      return;
    }

    setLoading(true);
    sessionStorage.setItem("resetToken", code);
    router.push("/nova-senha");
    setLoading(false);
  };

  const handleResend = async () => {
    const email = sessionStorage.getItem("resetEmail");
    if (!email) {
      setError("E-mail não encontrado. Volte à tela anterior e tente novamente.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");
    try {
      await forgotPassword(email);
      setResendMessage("Novo código enviado! Verifique seu e-mail.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao reenviar código.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 relative">
          <label
            htmlFor="codigo"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Código
          </label>

          <input
            type="text"
            id="codigo"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            required
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Insira o código"
          />
        </div>

        {/* Opção de reenviar código */}
        <div className="mb-6 -mt-1">
          <span className="text-gray-600 text-sm font-poppins">
            Não recebeu o código?{" "}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-red-600 hover:underline text-sm font-poppins disabled:opacity-50"
          >
            {resendLoading ? "Enviando..." : "Reenviar"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2 font-poppins">{error}</p>}
        {resendMessage && <p className="text-green-600 text-sm mb-2 font-poppins">{resendMessage}</p>}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </div>
      </form>
    </div>
  );
}