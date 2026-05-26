"use client";

import { useState, useEffect } from "react";
import { Camera, ImagePlus, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getMeuPerfil,
  updateMeuPerfil,
  deleteMinhaConta,
} from "@/app/services/perfilService";
import type { UpdatePerfilRequest } from "@/app/types/perfil";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ApiError = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
};

const avatarPadrao =
  "https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg";

export default function MeuPerfil() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(avatarPadrao);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    patente: "",
    senha: "",
    confirmarSenha: "",
    fotoBase64: "",
  });

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const dados = await getMeuPerfil();

        if (dados) {
          setFormData((prev) => ({
            ...prev,
            nome: dados.nome || "",
            email: dados.email || "",
            username: dados.username || "",
            patente: dados.patente || "Não ranqueado",
          }));

          if (dados.foto_perfil) {
            setAvatarPreview(dados.foto_perfil);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Não foi possível carregar seus dados.");
      } finally {
        setIsLoading(false);
      }
    }
    carregarPerfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fotoBase64: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isEditing) {
      if (formData.senha && formData.senha !== formData.confirmarSenha) {
        toast.error("As senhas não coincidem!");
        return;
      }

      try {
        const payload: any = {
          nome: formData.nome,
          email: formData.email,
        };

        if (formData.senha) {
          payload.senha = formData.senha;
        }

        if (formData.fotoBase64) {
          payload.foto_perfil = formData.fotoBase64;
        }

        await updateMeuPerfil(payload);
        toast.success("Perfil atualizado com sucesso!");

        setFormData((prev) => ({
          ...prev,
          senha: "",
          confirmarSenha: "",
          fotoBase64: "",
        }));
        setIsEditing(false);
        setMostrarSenha(false);
        setMostrarConfirmarSenha(false);
      } catch (error: unknown) {
        const apiError = error as ApiError;

        const mensagemErro =
          apiError.response?.data?.error || "Erro ao atualizar perfil.";

        console.error("Erro da API:", mensagemErro);
        toast.error(mensagemErro);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Saindo da conta...");
    setTimeout(() => router.push("/login"), 1000);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMinhaConta();
      localStorage.removeItem("token");
      toast.error("Conta deletada com sucesso.");
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar conta.");
    }
  };

  const inputClassName = `px-4 py-3 rounded-md text-sm text-gray-600 outline-none transition-colors w-full ${
    isEditing
      ? "bg-white border border-gray-300 focus:border-[#316f27] focus:ring-1 focus:ring-[#316f27]"
      : "bg-[#f6f6f6] border border-transparent"
  }`;

  const passwordInputClassName = `${inputClassName} pr-10`;

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen p-8 flex items-center justify-center">
        Carregando perfil...
      </div>
    );
  }

  return (
    <main className="w-full flex-1 min-h-screen p-8 box-border bg-[#f6f6f4]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 m-0">
          ⚽ Meu Perfil
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-8">{formData.email}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden pb-6">
        <div className="h-28 bg-gradient-to-r from-[#90e0ef] via-[#d4f29a] to-[#fff700]"></div>

        <div className="px-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-5">
            <div className="relative -mt-10">
              <div
                role="img"
                aria-label="Foto de perfil"
                style={{ backgroundImage: `url(${avatarPreview})` }}
                className="w-24 h-24 rounded-full border-4 border-white bg-white bg-cover bg-center shadow-sm relative"
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-[#316f27] text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md border-2 border-white flex items-center justify-center"
                    title="Alterar foto"
                  >
                    <ImagePlus size={16} strokeWidth={2.5} />
                  </label>
                </>
              )}
            </div>

            <div className="mt-2">
              <h2 className="m-0 text-xl text-gray-800 font-semibold">
                {formData.nome}
              </h2>
              <a
                href={`mailto:${formData.email}`}
                className="text-sm text-gray-500 hover:underline"
              >
                {formData.email}
              </a>
            </div>
          </div>

          <button
            onClick={handleEditToggle}
            className={`mt-4 md:mt-2 text-white border-none px-6 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
              isEditing
                ? "bg-green-600 hover:bg-green-800"
                : "bg-[#316f27] hover:bg-green-800"
            }`}
          >
            {isEditing ? "Salvar" : "Editar"}
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-10 pt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              readOnly={!isEditing}
              className={inputClassName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={inputClassName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Patente</label>
            <input
              type="text"
              name="patente"
              value={formData.patente}
              readOnly={true}
              className="px-4 py-3 rounded-md text-sm text-gray-500 bg-[#f6f6f6] border border-transparent outline-none cursor-not-allowed w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                placeholder={isEditing ? "Digite uma nova senha" : "••••••••"}
                value={formData.senha}
                onChange={handleChange}
                readOnly={!isEditing}
                className={passwordInputClassName}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                placeholder={isEditing ? "Confirme a nova senha" : "••••••••"}
                value={formData.confirmarSenha}
                onChange={handleChange}
                readOnly={!isEditing}
                className={passwordInputClassName}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarConfirmarSenha ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="px-10 mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="bg-[#de3f53] hover:bg-[#c43648] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
                <AlertDialogDescription>
                  A sua sessão será encerrada e precisará de fazer login
                  novamente para aceder à arena.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-[#316f27] hover:bg-green-800"
                >
                  Sim, sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="bg-[#de3f53] hover:bg-[#c43648] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Deletar conta
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  sua conta e removerá seus dados dos nossos servidores de
                  torneio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sim, deletar conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </main>
  );
}
