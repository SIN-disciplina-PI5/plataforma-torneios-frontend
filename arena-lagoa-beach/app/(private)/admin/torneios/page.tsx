"use client";
// 14/05 erro código, martins responsável
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trophy, Plus } from "lucide-react";
import { clsx } from "clsx";

import type { AdminDialogState, AdminTab, Tournament } from "./_types";
import { ADMIN_TABS } from "./_lib/constants";
import { fetchTournaments, deleteTournament } from "./_lib/api";
import { AdminTournamentCard } from "../../../../components/admin/AdminTournamentCard";
import { AdminTournamentDialogs } from "../../../../components/admin/AdminTournamentDialogs";
import styles from "./_styles/admin-tournaments.module.css";

export default function AdminTorneiosPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("Todos");
  const [search, setSearch] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<AdminDialogState>("idle");
  const [selected, setSelected] = useState<Tournament | null>(null);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    fetchTournaments()
      .then(setTournaments)
      .catch((err) => console.error("Erro ao carregar torneios:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const index = ADMIN_TABS.indexOf(activeTab);
      const el = tabsRef.current[index];
      if (el) {
        setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  function handleDeleteClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("confirmDelete");
  }

  function handleEditClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("edit");
  }

  function handleViewRegistrations(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("registrations");
  }

  async function handleConfirmDelete() {
    if (!selected) return;

    setDialogState("loadingDelete");

    try {
      await deleteTournament(selected.id);

      setTournaments((prev) =>
        prev.filter((t) => t.id !== selected.id)
      );

      setDialogState("successDelete");
    } catch {
      setDialogState("errorDelete");
    }
  }

  const filtered = tournaments.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <main className="min-h-screen px-8 py-6 relative">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full flex items-center justify-center select-none">
            <Image
              src="/variante-de-bola-de-futebol.png"
              alt="Bola"
              width={40}
              height={40}
            />
          </div>

          <h1 className="text-4xl font-semibold">Torneios</h1>

          <span className="ml-2 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="relative">
          <div
            className="flex items-end gap-6 mb-8 relative overflow-x-auto pb-1"
            role="tablist"
          >
            {ADMIN_TABS.map((tab, i) => (
              <button
                key={tab}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "pb-3 text-lg font-medium transition-colors whitespace-nowrap",
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tab}
              </button>
            ))}

            <span
              className={styles.tabIndicator}
              style={indicatorStyle}
            />
          </div>
        </div>

        {/* Banner */}
        <div
          className={clsx(
            "rounded-2xl mb-10 h-28 flex items-center justify-center",
            styles.banner
          )}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/cup.png"
              alt="Troféu"
              width={70}
              height={70}
            />

            <p className="text-white text-3xl font-bold text-center">
              {loading
                ? "..."
                : `${tournaments.length} Torneios`}{" "}
              <br /> esperando por você!
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-24 text-gray-400">
            Carregando torneios...
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <AdminTournamentCard
                key={t.id}
                tournament={t}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewRegistrations={handleViewRegistrations}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">
              Nenhum torneio encontrado
            </p>
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setDialogState("create")}
          className={styles.fab}
          aria-label="Criar novo torneio"
        >
          <Plus size={28} />
        </button>

      </main>

      <AdminTournamentDialogs
        state={dialogState}
        tournament={selected}
        onClose={() => setDialogState("idle")}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}