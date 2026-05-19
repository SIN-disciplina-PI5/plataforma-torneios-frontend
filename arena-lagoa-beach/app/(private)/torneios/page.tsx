"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trophy, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

import type { TournamentUI } from "@/app/types/torneios";
import {
  getTorneios,
  registerForTournament,
} from "@/app/services/torneioService";
import { TournamentCard } from "@/components/inscricao/TournamentCard";
import { TournamentDialogs } from "@/components/inscricao/TournamentDialogs";
import { DuplasModal } from "@/components/ui/DuplasModal";
import type { Dupla } from "@/app/types/duplas";
import styles from "./_styles/tournaments.module.css";

type Tab = "Todos" | "Essa semana" | "Favoritos";
type DialogState = "idle" | "confirm" | "loading" | "success" | "error";

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
  const [duplaSelecionada, setDuplaSelecionada] = useState<Dupla | null>(null);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

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

        setTournaments(data);
      } catch (err) {
        console.error("Erro ao buscar torneios:", err);
        setError("Erro ao carregar os torneios");
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTorneios();
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const index = TABS.indexOf(activeTab);
      const el = tabsRef.current[index];
      if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  function handleToggleFavorite(id: string) {
    setTournaments((prev) =>
      prev.map((t) =>
        t.id_torneio === id ? { ...t, favorite: !t.favorite } : t,
      ),
    );
  }

  function handleRegisterClick(tournament: TournamentUI) {
    setSelected(tournament);
    setDuplaModalOpen(true);
  }

  function handleDuplaSelecionada(dupla: Dupla) {
    setDuplaSelecionada(dupla);
    setDuplaModalOpen(false);
    setDialogState("confirm"); // agora sim abre o confirm
  }

  async function handleConfirmRegister() {
    if (!selected || !duplaSelecionada) return;
    setDialogState("loading");

    const result = await registerForTournament(
      selected.id_torneio,
      1,
      //duplaSelecionada.id, // ← passe o id da dupla para sua API
    );

    if (!result) {
      setDialogState("error");
      return;
    }

    setDialogState("success");
  }

  const filtered = tournaments
    .filter((t) => (activeTab === "Favoritos" ? t.favorite : true))
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
      <main className="min-h-screen px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/variante-de-bola-de-futebol.png"
            alt="Bola"
            width={40}
            height={40}
          />
          <h1 className="text-4xl font-semibold">Torneios</h1>
        </div>

        {/* Tabs */}
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
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                {tab}
              </button>
            ))}
            <span className={styles.tabIndicator} style={indicatorStyle} />
          </div>
        </div>

        {/* Banner */}
        <div
          className={clsx(
            "rounded-2xl mb-10 h-28 flex items-center justify-center",
            styles.banner,
          )}
        >
          <div className="flex items-center gap-3">
            <Image src="/cup.png" alt="Troféu" width={70} height={70} />
            <p className="text-white text-3xl font-bold text-center">
              {`${tournaments.length} Torneios`} <br /> esperando por você!
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum torneio encontrado</p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TournamentCard
                key={t.id_torneio}
                tournament={t}
                onToggleFavorite={() => handleToggleFavorite(t.id_torneio)}
                onRegister={handleRegisterClick}
              />
            ))}
          </div>
        )}
      </main>

      <TournamentDialogs
        state={dialogState}
        tournament={selected}
        onClose={() => setDialogState("idle")}
        onConfirm={handleConfirmRegister}
      />

      <DuplasModal
        isOpen={duplaModalOpen}
        onClose={() => setDuplaModalOpen(false)}
        onSelectDupla={handleDuplaSelecionada}
        onCreateDupla={async (query) => {
          // chame sua API para criar dupla aqui
          console.log("Criar dupla:", query);
        }}
        onAddPlayerToDupla={(duplaId) => {
          // abra seu fluxo de adicionar jogador
          console.log("Adicionar jogador à dupla:", duplaId);
        }}
        onLeave={() => {
          setDuplaSelecionada(null);
          setDuplaModalOpen(false);
        }}
        currentDuplaId={duplaSelecionada?.id ?? null}
      />
    </>
  );
}
