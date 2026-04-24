"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/services/password";

export function EsqueceuSenhaForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      sessionStorage.setItem("resetEmail", email);
      router.push("/recuperar-senha");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao enviar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label
            htmlFor="email"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Email
          </label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border border-gray-300 mb-3 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite seu email"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2 font-poppins">{error}</p>}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded w-96 cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}