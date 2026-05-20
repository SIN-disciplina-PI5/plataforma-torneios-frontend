"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, AlertCircle, Plus, X, Pencil } from "lucide-react";
import { clsx } from "clsx";

import type { Tournament, AdminDialogState } from "@/app/types/torneios";
import { getTorneios, deleteTorneio } from "@/app/services/torneioService";
import { AdminTournamentCard } from "@/components/admin/AdminTournamentCard";
import { AdminTournamentDialogs } from "@/components/admin/AdminTournamentDialogs";

import { EditTournamentForm } from "@/components/admin/adminEditarTorneio";

export default function AdminTorneiosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<AdminDialogState>("idle");
  const [selected, setSelected] = useState<Tournament | null>(null);

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

  function handleEditClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("edit");
  }

  function handleDeleteClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("confirmDelete");
  }

  function handleViewRegistrations(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("registrations");
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setDialogState("loadingDelete");

    const success = await deleteTorneio(selected.id_torneio);

    if (!success) {
      setDialogState("errorDelete");
      return;
    }

    setTournaments((prev) =>
      prev.filter((t) => t.id_torneio !== selected.id_torneio),
    );
    setDialogState("successDelete");
  }

  function handleClose() {
    setDialogState("idle");
    setSelected(null);
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/variante-de-bola-de-futebol.png"
              alt="Bola"
              width={40}
              height={40}
            />
            <h1 className="text-4xl font-semibold">Gerenciar Torneios</h1>
          </div>
          <button
            onClick={() => setDialogState("create")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Novo torneio
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {tournaments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum torneio cadastrado</p>
          </div>
        )}

        {tournaments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <AdminTournamentCard
                key={t.id_torneio}
                tournament={t}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewRegistrations={handleViewRegistrations}
              />
            ))}
          </div>
        )}
      </main>

      <AdminTournamentDialogs
        state={dialogState === "edit" ? "idle" : dialogState}
        tournament={selected}
        onClose={handleClose}
        onConfirmDelete={handleConfirmDelete}
      />

      {dialogState === "edit" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-[480px] p-6 m-4 relative animate-in fade-in zoom-in duration-200">
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                  <Pencil size={18} />
                </div>
                <h2 className="text-xl font-bold text-black">Editar torneio</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 ml-11">
              <p className="text-[14px] text-gray-500">
                Edição de:{" "}
                <span className="font-semibold text-black">
                  {selected.nome}
                </span>
              </p>
            </div>

            <EditTournamentForm tournament={selected} onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
}
