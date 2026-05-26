"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trophy, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";

import {
  getTorneios,
  getInscricaoDoUsuario,
  cancelarInscricao,
  registerUserInTournament,
  sairDaEquipe,
} from "@/app/services/torneioService";

import { TournamentCard } from "@/components/inscricao/TournamentCard";
import { DuplasModal } from "@/components/ui/DuplasModal";

import styles from "./_styles/tournaments.module.css";

type Tab = "Todos" | "Essa semana" | "Favoritos";

type DialogState =
  | "idle"
  | "confirm"
  | "loading"
  | "success"
  | "error";

const TABS: Tab[] = ["Todos", "Essa semana", "Favoritos"];

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

  const [confirmacaoOpen, setConfirmacaoOpen] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // TOKEN
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

  // FETCH TORNEIOS + INSCRIÇÃO
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

    if (usuarioId !== null) {
      fetchTorneios();
    }
  }, [usuarioId]);

  // INDICADOR TAB
  useEffect(() => {
    const updateIndicator = () => {
      const index = TABS.indexOf(activeTab);
      const el = tabsRef.current[index];

      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  function handleToggleFavorite(id: string) {
    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === id ? { ...t, favorite: !t.favorite } : t
      )
    );
  }

  function handleVerDuplas(tournament: TournamentUI) {
    setSelected(tournament);
    setDuplasTorneioId(tournament.id_torneio);
    setDuplaModalOpen(true);
  }

  async function handleRegisterClick(tournament: TournamentUI) {
    if (!usuarioId) {
      alert("Usuário não autenticado");
      return;
    }

    setSelected(tournament);

    const response = await registerUserInTournament(
      tournament.id_torneio,
      usuarioId.toString()
    );

    if (!response.sucesso) {
      alert(response.mensagem || "Erro ao se inscrever");
      return;
    }

    const id_inscricao = await getInscricaoDoUsuario(
      tournament.id_torneio,
      usuarioId.toString()
    );

    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === tournament.id_torneio
          ? {
              ...t,
              jaInscrito: true,
              id_inscricao,
            }
          : t
      )
    );

    setConfirmacaoOpen(true);
  }

  async function handleUnregister(tournament: TournamentUI) {
    if (!tournament.id_inscricao || !usuarioId) return;

    // Sai da dupla antes de cancelar a inscrição.
    // Se não estiver em nenhuma equipe, o service ignora silenciosamente (status 400).
    await sairDaEquipe(tournament.id_torneio);

    const response = await cancelarInscricao(tournament.id_inscricao);

    if (!response.sucesso) {
      alert(response.mensagem);
      return;
    }

    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === tournament.id_torneio
          ? { ...t, jaInscrito: false, id_inscricao: null }
          : t
      )
    );
  }

  // FIX: filtro "Essa semana" verifica se data_inicio do torneio
  // cai dentro da semana corrente (domingo a sábado).
  // Ajuste para segunda a domingo se necessário (ver comentário abaixo).
  const filtered = tournaments
    .filter((t) => {
      if (activeTab === "Favoritos") return t.favorite;

      if (activeTab === "Essa semana") {
        if (!t.data_inicio) return false;

        const hoje = new Date();

        // Semana começando no domingo (0). 
        // Para começar na segunda-feira, troque por:
        // const diaSemana = hoje.getDay() === 0 ? 6 : hoje.getDay() - 1;
        // inicioSemana.setDate(hoje.getDate() - diaSemana);
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        const dataInicio = new Date(t.data_inicio);
        return dataInicio >= inicioSemana && dataInicio <= fimSemana;
      }

      return true; // "Todos"
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
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
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
        <div
          className={clsx(
            "rounded-2xl mb-10 h-28 flex items-center justify-center",
            styles.banner
          )}
        >
          <div className="flex items-center gap-3">
            <Image src="/cup.png" alt="Troféu" width={70} height={70} />
            <p className="text-white text-3xl font-bold text-center">
              {`${tournaments.length} Torneios`}
              <br />
              esperando por você!
            </p>
          </div>
        </div>

        {/* ERRO */}
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
                onUnregister={handleUnregister}
                onVerDuplas={handleVerDuplas}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">
              Nenhum torneio encontrado
            </p>
          </div>
        )}
      </main>

      {/* POPUP CONFIRMAÇÃO */}
      {confirmacaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Inscrição realizada
            </h2>

            <p className="text-gray-600 mb-6">
              Você foi inscrito no torneio com sucesso.
            </p>

            <button
              onClick={() => {
                setConfirmacaoOpen(false);
                setDuplaModalOpen(true);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold"
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
              usuarioId.toString()
            );

            setTournaments((prev) =>
              prev.map((t) =>
                t.id_torneio === selected.id_torneio
                  ? {
                      ...t,
                      jaInscrito: !!id_inscricao,
                      id_inscricao,
                    }
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