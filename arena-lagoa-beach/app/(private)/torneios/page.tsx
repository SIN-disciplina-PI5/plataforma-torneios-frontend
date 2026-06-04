"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, AlertCircle, X } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";
import { torneioJaIniciou, edicaoBloqueada } from "@/app/types/torneios";

import {
  getTorneios,
  getInscricaoDoUsuario,
  cancelarInscricao,
  registerUserInTournament,
  sairDaEquipe,
} from "@/app/services/torneioService";

import { useNotificacao } from "@/lib/NotificacaoContext";
import { TournamentCard } from "@/components/inscricao/TournamentCard";
import { DuplasModal } from "@/components/ui/DuplasModal";

import styles from "./_styles/tournaments.module.css";

type Tab = "Todos" | "Essa semana" | "Meus Torneios" | "Favoritos" | "Finalizados";
type DialogState = "idle" | "confirm" | "loading" | "success" | "error";

const TABS: Tab[] = ["Todos", "Essa semana", "Meus Torneios", "Favoritos", "Finalizados"];

export default function TorneiosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Todos");
  const [search, setSearch] = useState("");

  const [tournaments, setTournaments] = useState<TournamentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [selected, setSelected] = useState<TournamentUI | null>(null);
  const [duplaModalOpen, setDuplaModalOpen] = useState(false);
  const [duplasTorneioId, setDuplasTorneioId] = useState<string>("");

  const [confirmacaoOpen, setConfirmacaoOpen] = useState(false);
  const [cancelacaoOpen, setCancelacaoOpen] = useState(false);
  const [confirmarCancelamentoOpen, setConfirmarCancelamentoOpen] = useState(false);
  const [tournamentParaCancelar, setTournamentParaCancelar] = useState<TournamentUI | null>(null);
  const [cancelandoInscricao, setCancelandoInscricao] = useState(false);
  const [erroOpen, setErroOpen] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [usuarioId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const t = localStorage.getItem("token");
      if (!t) return null;
      const payload = JSON.parse(atob(t.split(".")[1]));
      return payload.id ?? null;
    } catch {
      return null;
    }
  });

  const { mostrarToast } = useNotificacao();

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTorneios();
        if (!data) {
          setError("Falha ao carregar os torneios");
          setTournaments([]);
          return;
        }
        if (usuarioId) {
          const torneiosAtualizados = await Promise.all(
            data.map(async (torneio) => {
              const id_inscricao = await getInscricaoDoUsuario(
                torneio.id_torneio,
                usuarioId.toString(),
              );
              return { ...torneio, jaInscrito: !!id_inscricao, id_inscricao };
            }),
          );
          setTournaments(torneiosAtualizados);
        } else {
          setTournaments(data);
        }
      } catch (err) {
        console.error("Erro ao buscar torneios:", err);
        setError("Erro ao carregar os torneios");
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTorneios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleToggleFavorite(id: string) {
    setTournaments((prev) =>
      prev.map((t) => (t.id_torneio === id ? { ...t, favorite: !t.favorite } : t)),
    );
  }

  function handleVerDuplas(tournament: TournamentUI) {
    if (!tournament.jaInscrito) {
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "Acesso negado",
        mensagem: "É necessário estar inscrito no torneio para visualizar ou participar de equipes.",
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    setSelected(tournament);
    setDuplasTorneioId(tournament.id_torneio);
    setDuplaModalOpen(true);
  }

  async function handleRegisterClick(tournament: TournamentUI) {
    if (edicaoBloqueada(tournament) || torneioJaIniciou(tournament)) {
      setErroMensagem(
        torneioJaIniciou(tournament)
          ? "Este torneio já foi iniciado. Não é possível se inscrever."
          : "As inscrições para este torneio foram encerradas 2 dias antes do início.",
      );
      setErroOpen(true);
      return;
    }

    if (!usuarioId) {
      setErroMensagem("Usuário não autenticado. Faça login novamente.");
      setErroOpen(true);
      return;
    }

    setSelected(tournament);
    const response = await registerUserInTournament(
      tournament.id_torneio,
      usuarioId.toString(),
    );
    if (!response.sucesso) {
      setErroMensagem(response.mensagem || "Erro ao se inscrever no torneio.");
      setErroOpen(true);
      return;
    }
    const id_inscricao = await getInscricaoDoUsuario(
      tournament.id_torneio,
      usuarioId.toString(),
    );
    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === tournament.id_torneio
          ? { ...t, jaInscrito: true, id_inscricao }
          : t,
      ),
    );
    setConfirmacaoOpen(true);
  }

  function handleUnregisterClick(tournament: TournamentUI) {
    if (edicaoBloqueada(tournament) || torneioJaIniciou(tournament)) {
      setErroMensagem(
        torneioJaIniciou(tournament)
          ? "Este torneio já foi iniciado. Não é possível cancelar a inscrição."
          : "O prazo para cancelamento de inscrição já encerrou (2 dias antes do início).",
      );
      setErroOpen(true);
      return;
    }
    setTournamentParaCancelar(tournament);
    setConfirmarCancelamentoOpen(true);
  }

  async function handleConfirmarCancelamento() {
    const tournament = tournamentParaCancelar;
    if (!tournament?.id_inscricao || !usuarioId) return;

    setCancelandoInscricao(true);
    await sairDaEquipe(tournament.id_torneio);
    const response = await cancelarInscricao(tournament.id_inscricao);
    setCancelandoInscricao(false);
    setConfirmarCancelamentoOpen(false);
    setTournamentParaCancelar(null);

    if (!response.sucesso) {
      setErroMensagem(response.mensagem || "Erro ao cancelar inscrição.");
      setErroOpen(true);
      return;
    }
    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === tournament.id_torneio
          ? { ...t, jaInscrito: false, id_inscricao: null }
          : t,
      ),
    );
    mostrarToast({
      id_notificacao: Date.now().toString(),
      titulo: "Saiu da equipe",
      mensagem: "Você saiu da equipe e sua inscrição foi cancelada com sucesso.",
      tipo: "info",
      lida: false,
      createdAt: new Date().toISOString(),
    });
    setCancelacaoOpen(true);
  }

  const filtered = tournaments
    .filter((t) => {
      if (activeTab === "Favoritos") return t.favorite;
      if (activeTab === "Finalizados") {
        if (!t.data_fim) return false;
        return new Date(t.data_fim) < new Date();
      }
      if (activeTab === "Essa semana") {
        if (!t.data_inicio) return false;
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);
        const dataInicio = new Date(t.data_inicio);
        return dataInicio >= inicioSemana && dataInicio <= fimSemana;
      }
      if (activeTab === "Meus Torneios") return !!t.jaInscrito;
      return true;
    })
    .filter(
      (t) =>
        t.nome?.toLowerCase().includes(search.toLowerCase()) ||
        t.categoria?.toLowerCase().includes(search.toLowerCase()),
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
          <p className="text-gray-600 font-medium">Carregando torneios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">⚽ Torneios</h1>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-[13px] sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          className={clsx(
            "w-full rounded-2xl mb-8 sm:mb-10 p-5 sm:px-8 sm:h-28 flex items-center justify-start gap-4 sm:gap-6 overflow-hidden",
            styles.banner,
          )}
        >
          <div className="w-14 h-14 sm:w-[70px] sm:h-[70px] relative shrink-0">
            <Image src="/cup.png" alt="Troféu" fill className="object-contain" />
          </div>
          <p className="text-white text-xl sm:text-3xl font-bold leading-tight">
            {tournaments.length} Torneios
            <br className="hidden sm:block" /> esperando por você!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((t) => (
              <TournamentCard
                key={t.id_torneio}
                tournament={t}
                onToggleFavorite={handleToggleFavorite}
                onRegister={handleRegisterClick}
                onUnregister={handleUnregisterClick}
                onVerDuplas={handleVerDuplas}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-600 px-4 text-center">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-base sm:text-lg font-medium">
              {activeTab === "Meus Torneios"
                ? "Você ainda não está inscrito em nenhum torneio."
                : activeTab === "Finalizados"
                ? "Nenhum torneio finalizado encontrado."
                : "Nenhum torneio encontrado"}
            </p>
          </div>
        )}
      </main>

      {/* ── Popup: inscrição confirmada ── */}
      {confirmacaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
              Inscrição realizada
            </h2>
            <p className="text-gray-600 mb-6 text-center sm:text-left">
              Você foi inscrito no torneio com sucesso.
            </p>
            <button
              onClick={() => {
                setConfirmacaoOpen(false);
                if (selected?.id_torneio) {
                  setDuplasTorneioId(selected.id_torneio);
                  setDuplaModalOpen(true);
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold cursor-pointer transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ── Popup: confirmar cancelamento ── */}
      {confirmarCancelamentoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <X size={18} className="text-red-600" />
                </div>
                <h2 className="text-base sm:text-lg font-bold">Cancelar inscrição?</h2>
              </div>
              <button
                onClick={() => {
                  setConfirmarCancelamentoOpen(false);
                  setTournamentParaCancelar(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-6 text-center sm:text-left">
              Ao confirmar, sua inscrição será removida e você poderá perder sua vaga no torneio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmarCancelamentoOpen(false);
                  setTournamentParaCancelar(null);
                }}
                disabled={cancelandoInscricao}
                className="w-full sm:w-1/2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                disabled={cancelandoInscricao}
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition-colors disabled:opacity-60 cursor-pointer"
              >
                {cancelandoInscricao ? "Cancelando..." : "Ok"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Popup: cancelamento confirmado ── */}
      {cancelacaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
              Inscrição cancelada
            </h2>
            <p className="text-gray-600 mb-6 text-center sm:text-left">
              Inscrição cancelada com sucesso.
            </p>
            <button
              onClick={() => setCancelacaoOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold cursor-pointer transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ── Popup: erro ── */}
      {erroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X size={24} className="text-red-600" />
              </div>
            </div>
            <p className="text-center text-gray-800 font-medium mb-6 text-sm sm:text-base">
              {erroMensagem}
            </p>
            <button
              onClick={() => setErroOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold cursor-pointer transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <DuplasModal
        isOpen={duplaModalOpen}
        onClose={() => setDuplaModalOpen(false)}
        torneioId={duplasTorneioId}
        token={token || ""}
        usuarioId={usuarioId || 0}
        onSuccess={async () => {
          setDialogState("success");
          if (selected && usuarioId) {
            const id_inscricao = await getInscricaoDoUsuario(
              selected.id_torneio,
              usuarioId.toString(),
            );
            setTournaments((prev) =>
              prev.map((t) =>
                t.id_torneio === selected.id_torneio
                  ? { ...t, jaInscrito: !!id_inscricao, id_inscricao }
                  : t,
              ),
            );
          }
          setTimeout(() => setDialogState("idle"), 2000);
        }}
      />
    </>
  );
}