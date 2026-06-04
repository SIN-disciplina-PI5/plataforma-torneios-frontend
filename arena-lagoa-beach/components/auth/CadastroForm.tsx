"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import { signup } from "@/app/services/authCadastro";
import PopupModelo from "@/components/ui/PopupModelo";
import Recaptcha from "@/components/recaptcha/recaptcha";

export function CadastroForm() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [loading, setLoading] = useState(false);

  //  captcha
  const [recaptchaToken, setCaptchaToken] = useState<string | null>(null);

  //  modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // visualizar senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const senhaTem8Caracteres = senha.length >= 8;
  const senhaTemMaiuscula = /[A-Z]/.test(senha);
  const senhaTemMinuscula = /[a-z]/.test(senha);
  const senhaTemNumero = /\d/.test(senha);
  const senhaTemEspecial = /[@$!%*?&._-]/.test(senha);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      setModalMessage("Preencha todos os campos");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (senha !== confirmarSenha) {
      setModalMessage("As senhas não coincidem");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (!termosAceitos) {
      setModalMessage("Você precisa aceitar os termos");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    //  valida captcha
    if (!recaptchaToken) {
      setModalMessage("Confirme que você não é um robô");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await signup({
        nome,
        email,
        senha,
        recaptchaToken, // ENVIA PRO BACK
      });

      setModalMessage(res.message || "Cadastro realizado com sucesso!");
      setModalType("success");
      setModalOpen(true);

      // limpa formulário
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setTermosAceitos(false);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setModalMessage(error.response?.data?.error || "Erro ao cadastrar");
      setModalType("error");
      setModalOpen(true);

      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  // redirect após sucesso
  useEffect(() => {
    if (modalOpen && modalType === "success") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [modalOpen, modalType, router]);

  const handleModalClose = () => {
    setModalOpen(false);

    if (modalType === "success") {
      router.push("/login");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 sm:mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome de usuário
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3"
            placeholder="Digite seu nome"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3"
            placeholder="Digite seu email"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-white border border-gray-300 rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
              placeholder="Digite sua senha"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span
              className={
                senhaTem8Caracteres ? "text-green-600" : "text-red-500"
              }
            >
              • 8+ caracteres
            </span>

            <span
              className={senhaTemMaiuscula ? "text-green-600" : "text-red-500"}
            >
              • 1 maiúscula
            </span>

            <span
              className={senhaTemMinuscula ? "text-green-600" : "text-red-500"}
            >
              • 1 minúscula
            </span>

            <span
              className={senhaTemNumero ? "text-green-600" : "text-red-500"}
            >
              • 1 número
            </span>

            <span
              className={senhaTemEspecial ? "text-green-600" : "text-red-500"}
            >
              • 1 especial
            </span>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirme sua senha
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-white border border-gray-300 rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
              placeholder="Confirme sua senha"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-start gap-2 sm:mb-4 sm:items-center">
          <input
            type="checkbox"
            checked={termosAceitos}
            onChange={(e) => setTermosAceitos(e.target.checked)}
            className="h-4 w-4 accent-[#C2E96A]"
          />

          <span className="text-sm text-gray-700">
            Eu concordo com os{" "}
            <span className="text-red-500">
              Termos e Políticas de Privacidade
            </span>
          </span>
        </div>

        {/*  RECAPTCHA */}
        <div className="mb-3 flex max-w-full justify-center overflow-x-auto sm:mb-4">
          <Recaptcha
            ref={recaptchaRef}
            onChange={setCaptchaToken}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-[#2FA026] px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#25801E] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none sm:w-96"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

        <span className="text-sm text-gray-700 block text-center mt-4">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-red-500 hover:text-red-700">
            Faça login
          </Link>
        </span>
      </form>

      <PopupModelo
        isOpen={modalOpen}
        onClose={handleModalClose}
        type={modalType}
        title={modalType === "success" ? "Sucesso" : "Erro"}
      >
        <p className="text-center text-lg">{modalMessage}</p>
      </PopupModelo>
    </div>
  );
}
