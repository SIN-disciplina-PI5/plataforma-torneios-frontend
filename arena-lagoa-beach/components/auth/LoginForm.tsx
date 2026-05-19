"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/authLogin";
import PopupModelo from "@/components/ui/PopupModelo";
import Recaptcha from "@/components/recaptcha/recaptcha";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  //  captcha
  const [recaptchaToken, setCaptchaToken] = useState<string | null>(null);

  //  popup
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !senha) {
      setModalMessage("Preencha todos os campos");
      setModalOpen(true);
      return;
    }

    // valida captcha
    if (!recaptchaToken) {
      setModalMessage("Confirme que você não é um robô 🤖");
      setModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        email,
        senha,
        recaptchaToken,
      });

      // salva token
      localStorage.setItem("token", res.token);

      // sucesso
      router.push("/torneios");
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || "Erro ao fazer login");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite seu email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite sua senha"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 accent-[#C2E96A]"
            />
            <label className="text-sm text-gray-700">Lembre-se de mim</label>
          </div>

          <span className="text-sm text-red-500 hover:text-red-700 cursor-pointer">
            Esqueci minha senha
          </span>
        </div>

        {/* RECAPTCHA */}
        <div className="flex justify-center mb-4">
          <Recaptcha onChange={setCaptchaToken} />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2FA026] hover:bg-[#25801E] text-white font-bold py-2 px-4 rounded w-96 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </div>

        <span className="text-sm text-gray-700 block text-center mt-4">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-red-500 hover:text-red-700">
            Registre-se
          </Link>
        </span>
      </form>

      {/* 🔥 POPUP */}
      <PopupModelo
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Erro ❌"
        footer={
          <div className="w-full flex justify-center">
            <button
              onClick={() => setModalOpen(false)}
              className="w-3/4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        }
      >
        <p className="text-center text-lg">❌ {modalMessage}</p>
      </PopupModelo>
    </div>
  );
}
