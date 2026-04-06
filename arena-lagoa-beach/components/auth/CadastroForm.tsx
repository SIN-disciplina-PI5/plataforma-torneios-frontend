"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/services/authCadastro";
import PopupModelo from "@/components/ui/PopupModelo"; // ajusta o caminho se necessário

export function CadastroForm() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

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

    try {
      setLoading(true);

      const res = await signup({
        nome,
        email,
        senha,
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
    } catch (err: any) {
      setModalMessage(err.response?.data?.error || "Erro ao cadastrar");
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 auto redirect após sucesso
  useEffect(() => {
    if (modalOpen && modalType === "success") {
      const timer = setTimeout(() => {
        setModalOpen(false);
        router.push("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [modalOpen, modalType, router]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome de usuário
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite seu nome"
          />
        </div>

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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirme sua senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#C2E96A]"
            placeholder="Confirme sua senha"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
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

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2FA026] hover:bg-[#25801E] text-white font-bold py-2 px-4 rounded w-96 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
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

      {/* 🔥 POPUP */}
      <PopupModelo
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "success" ? "Sucesso 🎉" : "Erro ❌"}
        footer={
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                setModalOpen(false);
                if (modalType === "success") {
                  router.push("/login");
                }
              }}
              className={`w-3/4 py-2 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
                modalType === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              OK
            </button>
          </div>
        }
      >
        <p className="text-center text-lg">
          {modalType === "success" ? "✅" : "❌"} {modalMessage}
        </p>
      </PopupModelo>
    </div>
  );
}
