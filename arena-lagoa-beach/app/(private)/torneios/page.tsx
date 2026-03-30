"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Trophy } from "lucide-react";
import { clsx } from "clsx";

import type { DialogState, Tab, Tournament } from "./_types";
import { MOCK_TOURNAMENTS, TABS } from "./_lib/constants";
import { registerForTournament } from "./_lib/api";
import { TournamentCard } from "../../../components/inscricao/TournamentCard";
import { TournamentDialogs } from "../../../components/inscricao/TournamentDialogs";
import styles from "./_styles/tournaments.module.css";

export default function TorneiosPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("Essa semana");
  const [search, setSearch] = useState("");
  const [tournaments, setTournaments] =
    useState<Tournament[]>(MOCK_TOURNAMENTS);
  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [selected, setSelected] = useState<Tournament | null>(null);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const index = TABS.indexOf(activeTab);
    const el = tabsRef.current[index];

    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      const index = TABS.indexOf(activeTab);
      const el = tabsRef.current[index];

      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleToggleFavorite(id: number) {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t)),
    );
  }

  function handleRegisterClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("confirm");
  }

  async function handleConfirmRegister() {
    if (!selected) return;
    setDialogState("loading");

    try {
      const ID_EQUIPE_DO_USUARIO = 1;
      await registerForTournament(selected.id, ID_EQUIPE_DO_USUARIO);
      setDialogState("success");
    } catch {
      setDialogState("error");
    }
  }

  function handleCloseDialog() {
    setDialogState("idle");
    setSelected(null);
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered = tournaments
    .filter((t) => (activeTab === "Favoritos" ? t.favorite : true))
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.level.toLowerCase().includes(search.toLowerCase()),
    );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <main className="min-h-screen bg-neutral-100 px-8 py-6">
        {/* Título */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-neutral-300 flex items-center justify-center select-none">
            <Image
              src="/variante-de-bola-de-futebol.png"
              alt="Bola de futebol"
              width={40}
              height={40}
            />
          </div>
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
                role="tab"
                aria-selected={activeTab === tab}
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
            "rounded-2xl overflow-hidden mb-10 relative h-28 flex items-center justify-center",
            styles.banner,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="text-6xl">
              <Image src="/cup.png" alt="Troféu" width={70} height={70} />
            </div>
            <p className="text-white text-3xl font-bold  text-center">
              22 Torneios
              <br />
              esperando por você!
            </p>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onToggleFavorite={handleToggleFavorite}
                onRegister={handleRegisterClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum torneio encontrado</p>
          </div>
        )}
      </main>

      <TournamentDialogs
        state={dialogState}
        tournament={selected}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRegister}
      />
    </>
  );
}
