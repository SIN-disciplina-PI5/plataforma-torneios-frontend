"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/services/auth";

export function CadastroForm() {
  const router = useRouter();

  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [termosAceitos, setTermosAceitos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    if (!termosAceitos) {
      alert("Você precisa aceitar os termos");
      return;
    }

    try {
      setLoading(true);

      const res = await signup({
        nome,
        email,
        senha,
      });

      alert(res.message);

      // limpa formulário
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setTermosAceitos(false);

      // redireciona
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
}
