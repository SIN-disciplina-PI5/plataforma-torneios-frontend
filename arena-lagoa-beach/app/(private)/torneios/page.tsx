"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trophy, AlertCircle, X } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";

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

type Tab = "Todos" | "Essa semana" | "Meus Torneios" | "Favoritos";
type DialogState = "idle" | "confirm" | "loading" | "success" | "error";

const TABS: Tab[] = ["Todos", "Essa semana", "Meus Torneios", "Favoritos"];

export default function TorneiosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Essa semana");
  const [search, setSearch] = useState("");

  const [tournaments, setTournaments] = useState<TournamentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [selected, setSelected] = useState<TournamentUI | null>(null);
  const [duplaModalOpen, setDuplaModalOpen] = useState(false);
  const [duplasTorneioId, setDuplasTorneioId] = useState<string>("");

  // Popup: inscrição realizada com sucesso
  const [confirmacaoOpen, setConfirmacaoOpen] = useState(false);
  // Popup: cancelamento realizado com sucesso
  const [cancelacaoOpen, setCancelacaoOpen] = useState(false);
  // Popup: confirmação antes de cancelar (com botões Cancelar / Ok)
  const [confirmarCancelamentoOpen, setConfirmarCancelamentoOpen] = useState(false);
  const [tournamentParaCancelar, setTournamentParaCancelar] = useState<TournamentUI | null>(null);
  const [cancelandoInscricao, setCancelandoInscricao] = useState(false);
  // Popup: erro
  const [erroOpen, setErroOpen] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  const [token, setToken] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const { mostrarToast } = useNotificacao();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUsuarioId(payload.id);
    } catch (err) {
      console.error("Erro ao decodificar token", err);
    }
  }, []);

  // Buscar torneios + status de inscrição
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
                usuarioId.toString()
              );
              return {
                ...torneio,
                jaInscrito: !!id_inscricao,
                id_inscricao,
              };
            })
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
    if (usuarioId !== null) fetchTorneios();
  }, [usuarioId]);

  // Indicador da tab
  useEffect(() => {
    const updateIndicator = () => {
      const index = TABS.indexOf(activeTab);
      const el = tabsRef.current[index];
      if (el) {
        setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  function handleToggleFavorite(id: string) {
    setTournaments((prev) =>
      prev.map((t) => (t.id_torneio === id ? { ...t, favorite: !t.favorite } : t))
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
    if (!usuarioId) {
      setErroMensagem("Usuário não autenticado. Faça login novamente.");
      setErroOpen(true);
      return;
    }
    setSelected(tournament);
    const response = await registerUserInTournament(tournament.id_torneio, usuarioId.toString());
    if (!response.sucesso) {
      setErroMensagem(response.mensagem || "Erro ao se inscrever no torneio.");
      setErroOpen(true);
      return;
    }
    const id_inscricao = await getInscricaoDoUsuario(tournament.id_torneio, usuarioId.toString());
    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === tournament.id_torneio
          ? { ...t, jaInscrito: true, id_inscricao }
          : t
      )
    );
    setConfirmacaoOpen(true);
  }

  // Abre popup de confirmação antes de cancelar
  function handleUnregisterClick(tournament: TournamentUI) {
    setTournamentParaCancelar(tournament);
    setConfirmarCancelamentoOpen(true);
  }

  // Executado após usuário confirmar o cancelamento
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
          : t
      )
    );
    setCancelacaoOpen(true);
  }

  // Filtros das tabs
  const filtered = tournaments
    .filter((t) => {
      if (activeTab === "Favoritos") return t.favorite;
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
      if (activeTab === "Meus Torneios") {
        return !!t.jaInscrito;
      }
      return true;
    })
    .filter(
      (t) =>
        t.nome?.toLowerCase().includes(search.toLowerCase()) ||
        t.categoria?.toLowerCase().includes(search.toLowerCase())
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
      <main className="min-h-screen px-8 py-6">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-semibold">⚽ Torneios</h1>
        </div>

        {/* TABS */}
        <div className="relative">
          <div className="flex items-end gap-6 mb-8 relative" role="tablist">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                ref={(el) => { tabsRef.current[i] = el; }}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "pb-3 text-lg font-medium transition-colors",
                  activeTab === tab ? "text-black" : "text-gray-500"
                )}
              >
                {tab}
              </button>
            ))}
            <span className={styles.tabIndicator} style={indicatorStyle} />
          </div>
        </div>

        {/* BANNER */}
        <div className={clsx("rounded-2xl mb-10 h-28 flex items-center justify-center", styles.banner)}>
          <div className="flex items-center gap-3">
            <Image src="/cup.png" alt="Troféu" width={70} height={70} />
            <p className="text-white text-3xl font-bold text-center">
              {`${tournaments.length} Torneios`}
              <br />
              esperando por você!
            </p>
          </div>
        </div>

        {/* ERRO DE CARREGAMENTO */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* LISTA */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">
              {activeTab === "Meus Torneios"
                ? "Você ainda não está inscrito em nenhum torneio."
                : "Nenhum torneio encontrado"}
            </p>
          </div>
        )}
      </main>

      {/* POPUP CONFIRMAÇÃO DE INSCRIÇÃO */}
      {confirmacaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Inscrição realizada</h2>
            <p className="text-gray-600 mb-6">Você foi inscrito no torneio com sucesso.</p>
            <button
              onClick={() => {
                setConfirmacaoOpen(false);
                if (selected?.id_torneio) {
                  setDuplasTorneioId(selected.id_torneio);
                  setDuplaModalOpen(true);
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* POPUP CONFIRMAÇÃO ANTES DE CANCELAR */}
      {confirmarCancelamentoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                  <X size={18} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold">Cancelar inscrição no torneio?</h2>
              </div>
              <button
                onClick={() => {
                  setConfirmarCancelamentoOpen(false);
                  setTournamentParaCancelar(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Ao confirmar, sua inscrição será removida e você poderá perder sua vaga no torneio.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmarCancelamentoOpen(false);
                  setTournamentParaCancelar(null);
                }}
                disabled={cancelandoInscricao}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                disabled={cancelandoInscricao}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition-colors disabled:opacity-60"
              >
                {cancelandoInscricao ? "Cancelando..." : "Ok"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CANCELAMENTO REALIZADO COM SUCESSO */}
      {cancelacaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Inscrição cancelada</h2>
            <p className="text-gray-600 mb-6">Inscrição cancelada com sucesso.</p>
            <button
              onClick={() => setCancelacaoOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* POPUP ERRO */}
      {erroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X size={24} className="text-red-600" />
              </div>
            </div>
            <p className="text-center text-gray-800 font-medium mb-6">{erroMensagem}</p>
            <button
              onClick={() => setErroOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
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
            const id_inscricao = await getInscricaoDoUsuario(selected.id_torneio, usuarioId.toString());
            setTournaments((prev) =>
              prev.map((t) =>
                t.id_torneio === selected.id_torneio
                  ? { ...t, jaInscrito: !!id_inscricao, id_inscricao }
                  : t
              )
            );
          }
          setTimeout(() => setDialogState("idle"), 2000);
        }}
      />
    </>
  );
}