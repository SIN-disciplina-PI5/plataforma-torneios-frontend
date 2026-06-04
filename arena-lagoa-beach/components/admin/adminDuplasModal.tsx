"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { api } from "@/app/services/api";
import { toast } from "sonner";
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
import { AVATAR_PADRAO } from "@/app/utils/auth";

interface AdminDuplasModalProps {
  onClose: () => void;
  tournament: any;
}

export function AdminDuplasModal({
  onClose,
  tournament,
}: AdminDuplasModalProps) {
  const [duplas, setDuplas] = useState<any[]>([]);
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [duplaSelecionadaId, setDuplaSelecionadaId] = useState<
    string | number | null
  >(null);

  const [busca, setBusca] = useState("");
  const [jogadorSelecionado, setJogadorSelecionado] = useState<any | null>(
    null,
  );
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const resEquipes = await api.get(
        `/equipe?id_torneio=${tournament.id_torneio}`,
        config,
      );
      const equipes = Array.isArray(resEquipes.data)
        ? resEquipes.data
        : resEquipes.data.data || [];
      setDuplas(equipes);

      const resInscricoes = await api.get(
        `/inscricoes/torneio/${tournament.id_torneio}`,
        config,
      );

      const listaInscritos = Array.isArray(resInscricoes.data)
        ? resInscricoes.data
        : resInscricoes.data.data || [];

      setInscricoes(listaInscritos);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    if (tournament?.id_torneio) {
      fetchData();
    }
  }, [tournament]);

  const jogadoresFiltrados = inscricoes.filter((insc) => {
    const nomeJogador = insc.usuario?.nome || insc.nome || "";
    return nomeJogador.toLowerCase().includes(busca.toLowerCase());
  });

  const handleCriarDupla = async () => {
    if (!jogadorSelecionado) {
      toast.warning(
        "Por favor, pesquise e selecione um jogador inscrito primeiro!",
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const id_usuario =
        jogadorSelecionado.usuario?.id_usuario || jogadorSelecionado.id_usuario;
      const nomeJogador =
        jogadorSelecionado.usuario?.nome || jogadorSelecionado.nome;

      await api.post(
        `/equipe/${tournament.id_torneio}`,
        {
          nome: `Dupla de ${nomeJogador}`,
          id_usuario: id_usuario,
        },
        config,
      );

      toast.success("Dupla criada com sucesso!");
      setBusca("");
      setJogadorSelecionado(null);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao criar dupla:", error);
      toast.error(error.response?.data?.error || "Erro ao criar dupla.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarNaDuplaExistente = async (idEquipe: string | number) => {
    if (!jogadorSelecionado) {
      toast.warning(
        "Por favor, pesquise e selecione um jogador inscrito primeiro!",
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const id_usuario =
        jogadorSelecionado.usuario?.id_usuario || jogadorSelecionado.id_usuario;

      await api.post(
        `/equipe/admin/${idEquipe}/membros`,
        {
          id_usuario: id_usuario,
        },
        config,
      );

      toast.success("Jogador adicionado à dupla!");
      setBusca("");
      setJogadorSelecionado(null);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao adicionar membro:", error);
      toast.error(error.response?.data?.error || "Erro ao adicionar jogador.");
    } finally {
      setLoading(false);
    }
  };

  const executarRemocaoJogador = async (
    idEquipe: string | number,
    idUsuario: string | number,
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await api.delete(
        `/equipe/admin/${idEquipe}/membros/${idUsuario}`,
        config,
      );
      toast.success("Jogador removido com sucesso!");
      fetchData();
    } catch (error: any) {
      console.error("Erro ao remover jogador:", error);
      toast.error(error.response?.data?.error || "Erro ao remover o jogador.");
    } finally {
      setLoading(false);
    }
  };

  const executarExclusaoDupla = async () => {
    if (!duplaSelecionadaId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await api.delete(`/equipe/${duplaSelecionadaId}`, config);
      toast.success("Equipe excluída com sucesso!");
      setDuplaSelecionadaId(null);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao excluir dupla:", error);
      toast.error(error.response?.data?.error || "Erro ao excluir a equipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] p-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-gray-900">Duplas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setJogadorSelecionado(null);
                setMostrarResultados(true);
              }}
              onFocus={() => setMostrarResultados(true)}
              placeholder="Buscar jogador inscrito..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {mostrarResultados && busca && jogadoresFiltrados.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 shadow-lg rounded-lg max-h-40 overflow-y-auto z-10 custom-scrollbar">
                {jogadoresFiltrados.map((insc, idx) => {
                  const nome =
                    insc.usuario?.nome || insc.nome || "Desconhecido";
                  return (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm text-gray-700 transition-colors"
                      onClick={() => {
                        setJogadorSelecionado(insc);
                        setBusca(nome);
                        setMostrarResultados(false);
                      }}
                    >
                      {nome}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleCriarDupla}
            disabled={loading || !jogadorSelecionado}
            className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Dupla
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {duplas.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              Nenhuma equipe cadastrada neste torneio.
            </p>
          ) : (
            duplas.map((dupla) => {
              const membros = dupla.usuarios || dupla.membros || [];
              const jogador1 = membros[0] ? membros[0] : null;
              const jogador2 = membros[1] ? membros[1] : null;
              const idEquipe = dupla.id_equipe || dupla.id;

              return (
                <div
                  key={idEquipe}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${
                    duplaSelecionadaId === idEquipe
                      ? "border-2 border-gray-200"
                      : "border-2 border-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => setDuplaSelecionadaId(idEquipe)}
                >
                  <div className="flex items-center gap-3 w-[45%]">
                    {jogador1 ? (
                      <>
                        <div
                          className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${jogador1.foto_perfil || AVATAR_PADRAO}")`,
                          }}
                        ></div>

                        <span className="text-[14px] font-semibold text-gray-800 truncate">
                          {jogador1.nome}
                        </span>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-400 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remover Jogador
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover{" "}
                                <b>{jogador1.nome}</b> desta dupla?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  executarRemocaoJogador(
                                    idEquipe,
                                    jogador1.id_usuario || jogador1.id,
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                Sim, remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <span className="text-[14px] text-gray-400 italic">
                        Vazio
                      </span>
                    )}
                  </div>

                  <div className="w-[10%] flex justify-center"></div>

                  <div className="flex items-center gap-3 w-[45%]">
                    {jogador2 ? (
                      <>
                        <div
                          className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${jogador2.foto_perfil || AVATAR_PADRAO}")`,
                          }}
                        ></div>

                        <span className="text-[14px] font-semibold text-gray-800 truncate">
                          {jogador2.nome}
                        </span>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-400 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remover Jogador
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover{" "}
                                <b>{jogador2.nome}</b> desta dupla?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  executarRemocaoJogador(
                                    idEquipe,
                                    jogador2.id_usuario || jogador2.id,
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                Sim, remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <div className="flex-1 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdicionarNaDuplaExistente(idEquipe);
                          }}
                          className="text-black hover:text-gray-600 transition-colors cursor-pointer"
                          title="Selecione um jogador na busca e clique aqui para adicioná-lo"
                        >
                          <Plus size={24} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={!duplaSelecionadaId || loading}
              className={`w-full font-semibold text-[15px] py-3 rounded-lg transition-colors ${
                !duplaSelecionadaId
                  ? "bg-red-300 text-white cursor-not-allowed"
                  : "bg-[#ef4444] hover:bg-red-600 text-white cursor-pointer"
              }`}
            >
              {loading ? "Processando..." : "Excluir dupla"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Dupla</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza absoluta que deseja excluir esta equipe do torneio?
                Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={executarExclusaoDupla}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Sim, excluir dupla
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
