"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; 

import { login } from "@/app/services/authLogin";
import { getUserRole } from "@/app/utils/auth";
import PopupModelo from "@/components/ui/PopupModelo";
import Recaptcha from "@/components/recaptcha/recaptcha";

type LoginApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      erro?: string;
    };
  };
};

function getLoginErrorMessage(err: unknown) {
  const error = err as LoginApiError;
  const apiMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.erro;

  if (apiMessage) {
    return apiMessage;
  }

  switch (error.response?.status) {
    case 404:
      return "E-mail não encontrado";
    case 401:
    case 403:
      return "E-mail ou senha incorretos";
    default:
      return "Erro ao fazer login";
  }
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 controle da visualização da senha
  const [showPassword, setShowPassword] = useState(false);

  // captcha
  const [recaptchaToken, setCaptchaToken] = useState<string | null>(null);

  // popup
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !senha) {
      setModalMessage("Preencha todos os campos");
      setModalOpen(true);
      return;
    }

    if (!recaptchaToken) {
      setModalMessage("Confirme que você não é um robô");
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

      localStorage.setItem("token", res.token);

      const role = getUserRole();
      const redirectPath =
        role === "ADMIN" ? "/admin/torneios" : "/torneios";

      router.push(redirectPath);
    } catch (err: unknown) {
      setModalMessage(getLoginErrorMessage(err));
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

          {/* 👇 container relativo */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-white border border-gray-300 rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
              placeholder="Digite sua senha"
            />

            {/* 👇 botão do olho */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 accent-[#C2E96A]"
            />

            <label className="text-sm text-gray-700">
              Lembre-se de mim
            </label>
          </div>

          <Link
            href="/esqueceu-senha"
            className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
          >
            Esqueci minha senha
          </Link>
        </div>

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

      <PopupModelo
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="error"
        title="Erro"
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
        <p className="text-center text-lg">{modalMessage}</p>
      </PopupModelo>
    </div>
  );
}
